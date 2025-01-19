import React, { useState } from "react";
import Navbar from "../dashboard/Navbar";
import { CircularProgress } from "@mui/material";
import { getUser, getToken } from "../utils";
import axios from "axios";

const Survey = () => {
    const user = getUser();
    const token = getToken();

    const questions = [
        { id: "age", text: "What is your age?", type: "number", placeholder: "Enter your age" },
        { id: "weight", text: "What is your weight (in lbs)?", type: "number", placeholder: "Enter your weight" },
        { id: "activity", text: "What is your activity level?", type: "select", options: ["Low", "Moderate", "High"] },
        {
            id: "goal",
            text: "What are your health goals?",
            type: "select",
            options: [
                "Lose weight and gain muscle",
                "Gain weight and gain muscle",
                "Maintain and gain muscle",
            ],
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    const sendResults = async () => {
        try {
            const response = await axios.post('http://18.220.193.103:8080/api/v1/user/getSurveyResults', responses, {
                params: {
                    user_id: user.id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setResponses((prev) => ({ ...prev, [id]: value }));
    };

    const handleNext = () => {
        if (!responses[questions[currentQuestion].id]) {
            alert("Please answer the question before proceeding.");
            return;
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setIsCompleted(true);
            sendResults(); // Call sendResults when the survey is completed
        }
    };

    const renderInputField = (question) => {
        switch (question.type) {
            case "select":
                return (
                    <select
                        id={question.id}
                        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={responses[question.id] || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">Select an option</option>
                        {question.options.map((option) => (
                            <option key={option} value={option.toLowerCase()}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        type={question.type}
                        id={question.id}
                        placeholder={question.placeholder}
                        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={responses[question.id] || ""}
                        onChange={handleInputChange}
                    />
                );
        }
    };

    const reloadScreen = () => {
        setTimeout(() => {
            window.location.reload();
        }, 5000); // 5 seconds delay before refreshing the page
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-blue-50">
            {/* Banner Section */}
            <div className="w-full text-center mt-10">
                <h1 className="text-4xl font-bold text-blue-600">Tell us about yourself first!</h1>
            </div>

            {/* Survey Section */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-12 border-2 border-blue-300">
                {isCompleted ? (
                    <>
                        <div className="flex flex-col justify-center items-center space-y-4 h-32">
                            <CircularProgress />
                            <div className="text-blue-600 font-medium">Fetching your personalized plan!</div>
                            {reloadScreen()}
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-blue-600 mb-4">
                            {questions[currentQuestion].text}
                        </h1>
                        <div className="mb-6">{renderInputField(questions[currentQuestion])}</div>
                        <button
                            onClick={handleNext}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Next
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Survey;


