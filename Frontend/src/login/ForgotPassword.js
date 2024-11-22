// src/ForgotPassword.js

import React, { useState } from 'react';

import {useNavigate} from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setMessage('Password reset link sent to your email!');
            setError('');
        }, 1000);
    };

    const handleBackButton = () => {
        navigate("/")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email address to receive a password reset link.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Send Reset Link
                    </button>
                    <button
                        onClick={() => handleBackButton()}
                        className="w-half mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
