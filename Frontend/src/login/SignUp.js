// src/SignUp.js

import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        dob: ''
    });
    var phoneRegex = /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    let params = new URLSearchParams(window.location.search);
    let github_id = params.get("githubID") || null;
    let google_id = params.get("googleID") || null;

    const navigate = useNavigate()

    useEffect(() => {
        if(github_id  || google_id) {
            setError("Account Not Found! Please Sign Up. Account will be automatically linked!")
        }
    }, [github_id, google_id]);

    function testPhoneNumber(phoneNumber) {
        return phoneRegex.test(phoneNumber);
    }

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const   handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setMessage('')
        const {username, firstname, lastname, email, phone, dob, password} = formData;


        const signUpRequest = {
            firstname : firstname,
            lastname : lastname,
            username : username,
            password: password,
            email : email,
            phone: phone,
            dob: dob,
            github_id: github_id,
            google_id : google_id,
        }
        // Simple validation
        if (!username || !firstname || !lastname || !email || !phone || !dob || !password) {
            setError('All fields are required.');
            return;
        }
        else if(!testPhoneNumber(phone)) {
            setError("Phone number is not valid")
            return;
        }

        try{
            console.log(formData)
            const response = await axios.post('https://api.fitttrack.com/api/v1/auth/register', signUpRequest, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(response.status === 200){
                console.log("success")
                setTimeout(() => {
                    setMessage('Sign up successful! Please check your email for verification.');
                    setError('');
                    console.log(dob)
                }, 1000);
            }
            else{

                console.log(response)
            }
        } catch (error){
            setMessage(error.message)
            console.log(error.message)
        }


    };

    const handleBackButton = () => {
        navigate("/")
    }

    return (
        <div className=" flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    <div className="mb-4">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="First Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Last Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Phone Number"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>
                <button
                    onClick={() => handleBackButton()}
                    className="w-half mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default SignUp;
