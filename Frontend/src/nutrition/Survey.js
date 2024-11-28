import React, { useState } from "react";
import Navbar from "../dashboard/Navbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar } from "@mui/material";

const Survey = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#1976d2",
            },
        },
    });

    const questions = [
        { id: "age", text: "What is your age?", type: "number", placeholder: "Enter your age" },
        { id: "weight", text: "What is your weight (in lbs)?", type: "decimal", placeholder: "Enter your weight" },
        { id: "activity", text: "What is your activity level?", type: "select", options: ["Low", "Moderate", "High"] },
        {
            id: "goal",
            text: "What are your health goals?",
            type: "select",
            options: [
                "Gain weight",
                "Lose weight",
                "Lose weight and gain muscle",
                "Gain weight and gain muscle",
                "Maintain and gain muscle",
            ],
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

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

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>
            <div className="min-h-screen flex flex-col items-center bg-blue-50">
                {/* Banner Section */}
                <div className="w-full text-center mt-10">
                    <h1 className="text-4xl font-bold text-blue-600">Tell us about yourself first!</h1>
                </div>

                {/* Survey Section */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-12 border-2 border-blue-300">
                    {isCompleted ? (
                        <>
                            <h1 className="text-2xl font-semibold text-blue-600 mb-4">Thank you!</h1>
                            <p className="text-gray-700 mb-6">Your responses have been recorded.</p>
                            <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(responses, null, 2)}</pre>
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
        </ThemeProvider>
    );
};

export default Survey;

