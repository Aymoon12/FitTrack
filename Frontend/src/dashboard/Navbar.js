// src/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';



const Navbar = () => {

    const handleLogout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('uuid')

    }
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold italic ">FITTRACK</h1>
                <div className="hidden md:flex space-x-4">
                    <Link to="/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        Home
                    </Link>
                    <Link to="/trackcalories" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        Track
                    </Link>
                    <Link to="/workouts" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        Workouts
                    </Link>
                    <Link to="/nutrition" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        Nutrition
                    </Link>
                    <Link to="/settings" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        Profile
                    </Link>
                    <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded" onClick={handleLogout}>
                        Logout
                    </Link>
                </div>
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
