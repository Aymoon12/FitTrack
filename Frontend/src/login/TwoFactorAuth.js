// src/TwoFactorAuth.js

import React, { useState } from 'react';
import {getUUID} from "../utils";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const TwoFactorAuth = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uuid = getUUID();


        const twoFactorRequest  = {
            otp: code,
            uuid:uuid,
        }

        try{
            const response  = await axios.post('http://localhost:8080/api/v1/auth/verifyOTP',twoFactorRequest,{
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            localStorage.removeItem('uuid')
            console.log(response)
            let token = response.data.token
            localStorage.setItem('token',token);
            let user = response.data.userDTO;
            localStorage.setItem('user',JSON.stringify(user));

        }catch(error){

        }
        if (code === '') {
            setError('Please enter the code.');
        } else {
            verifyCode(code)
                .then((response) => {
                    console.log('Code verified successfully:', response);
                })
                .catch((err) => {
                    setError('Invalid code. Please try again.');
                });
        }
        navigate("/dashboard")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Two-Factor Authentication</h2>
                <p className="text-gray-600 text-center mb-6">Enter the code sent to your email:</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                            placeholder="Enter your code"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Verify Code
                    </button>
                </form>
            </div>
        </div>
    );
};

const verifyCode = async (code) => {
    if (code === '123456') { // Replace this with actual verification logic
        return Promise.resolve('Success');
    } else {
        return Promise.reject('Invalid code');
    }
};

export default TwoFactorAuth;
