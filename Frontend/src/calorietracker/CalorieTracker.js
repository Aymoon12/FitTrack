
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../dashboard/Navbar";
import {AppBar, CircularProgress, Modal} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { getUser, getToken } from '../utils';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {toast, ToastContainer} from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const CalorieTracker = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(
        new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    );
    const [logs, setLogs] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack : [],
    });
    const user = getUser();
    let userId = user.id;
    let token = getToken();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [servingSize, setServingSize] = useState(1);
    const [modalType, setModalType] = useState('')

    const [calorieGoal, setCalorieGoal] = useState(null);
    const [proteinGoal, setProteinGoal] = useState(null);
    const [carbGoal, setCarbGoal] = useState(null);
    const [fatGoal, setFatGoal] = useState(null);
    const [stepGoal, setStepGoal] = useState(null);
    // Fetch logs from the backend
    const fetchLogs = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('http://localhost:8080/api/v1/food/getAllMeals', {
                params: {
                    user_id: userId,
                    date: date,
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false); // End loading
        }
    }, [userId, date, token]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleAddFood = (mealType, date) => {
        navigate(`/search/?mealType=${mealType}&date=${date}`);
    };

    const handleDeleteFood = async (foodId) => {
        try {
            const response = await axios.delete("http://localhost:8080/api/v1/food/deleteFood", {
                params: {
                    food_id: foodId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                await fetchLogs(); // Refresh logs after deletion
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const calculateTotals = () => {
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFats = 0;

        Object.values(logs).forEach(meal => {
            meal.forEach(food => {
                totalCalories += Math.round(((food.calories * food.servings) * 100) / 100);
                totalFats += Math.round(((food.fat_total_g * food.servings) * 100) / 100);
                totalCarbs += Math.round(((food.carbohydrates_total_g * food.servings) * 100) / 100);
                totalProtein += Math.round(((food.protein_g * food.servings) * 100) / 100);
            });
        });

        return { totalCalories, totalCarbs, totalProtein, totalFats };
    };

    const { totalCalories, totalCarbs, totalProtein, totalFats } = calculateTotals();

    const data = {
        labels: ['Fats', 'Carbs', 'Protein'],
        datasets: [
            {
                label: 'Nutritional Breakdown',
                data: [totalFats, totalCarbs, totalProtein],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                hoverOffset: 4,
            },
        ],
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });
    const openViewModal = (food) => {
        console.log('Selected Food:', food); // Debugging line
        setSelectedFood(food);
        setModalType("View")
        setServingSize(food.servingSize); // Reset serving size
        setModalIsOpen(true);
    };

    const closeViewModal = () => {
        setModalIsOpen(false);
        setModalType('')
        setSelectedFood(null);

    };

    const openEditGoalModal = () => {
        setModalType("Edit Goals")
        setModalIsOpen(true);
    };

    const closeEditGoalModal = () => {
        setModalIsOpen(false);
        setModalType('')
        setStepGoal(null)
        setCalorieGoal(null)
        setProteinGoal(null)
        setCarbGoal(null)
        setStepGoal(null)
        setFatGoal(null)
    };

    const handleServingSizeChange = async (food_id, newServingSize) => {

        try {

            const response = await axios.patch('http://localhost:8080/api/v1/food/updateServingSize', {
                food_id: food_id, // Send food_id in the body
                servingSize: newServingSize // Send servingSize in the body
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status === 200){
                toast.success("Successfully updated!");
                await fetchLogs();
            }

        } catch (e) {
            console.log(e.message)
        }
    }


    const handleEditGoalSubmit = async (e) => {
        e.preventDefault()
        const editGoalsRequest = {
            user_id: userId,
            goalCalories : calorieGoal,
            goalProtein: proteinGoal,
            goalCarbohydrates: carbGoal,
            goalFats: fatGoal,
            goalSteps: stepGoal,
        }

        try{
            const response = await axios.post("http://localhost:8080/api/v1/user/updateGoals", editGoalsRequest, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if(response === 200){
                toast.success(response.data)
            }
        }catch(e){
            console.log(e.message);
        }
    }

    const handleBackButton = () => {
        navigate("/dashboard")
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>
            <div className="flex max-w-7xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
                {/* Left Side: Meal Sections */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">Nutrition Tracker</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Select Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            className="border border-gray-300 p-2 rounded mb-4 w-full"
                        />
                    </div>

                    {/* Meal Sections */}
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                        <div className="mt-6" key={mealType}>
                            <h3 className="text-xl font-semibold capitalize">{mealType}</h3>
                            <ul className="mt-2">
                                {logs[mealType].map((food, index) => (
                                    <li key={index} className="border-b py-2 flex justify-between items-center">
                                        <span>
                                            {food.name} - {Math.round(((food.calories * food.servings) * 100) / 100)} calories
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>  openViewModal(food)}
                                                className="bg-blue-500 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFood(food.id)}
                                                className="bg-red-500 text-white font-semibold py-1 px-2 border border-red-500 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleAddFood(mealType.charAt(0).toUpperCase() + mealType.slice(1), date)}
                                className="text-blue-500">
                                Add Food
                            </button>

                        </div>
                    ))}


                    <div className="flex justify-between">
                        <button
                            onClick={openEditGoalModal}
                            className="bg-blue-500 mt-10 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700">
                            Edit Food Goals
                        </button>



                    <button
                        onClick={handleBackButton}
                        className="bg-blue-500 mt-10 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700">
                        Back
                    </button>
                    </div>

                </div>

                {/* Right Side: Totals and Pie Chart */}
                <div className="ml-10 w-1/3">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Daily Totals</h3>
                        <p>Total Calories: {totalCalories}</p>
                        <p>Total Fats: {totalFats}g</p>
                        <p>Total Carbs: {totalCarbs}g</p>
                        <p>Total Protein: {totalProtein}g</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Nutritional Breakdown</h3>
                            <Pie data={data} />
                        </div>
                    )}{/* Circular Progress Indicator */}

                </div>
                {/* View Modal, for viewing logged Food */}
                {selectedFood && modalIsOpen && (modalType === "View") && (
                    <Modal
                        open={modalIsOpen}
                        onClose={closeViewModal}
                        aria-labelledby="food-details-title"
                        aria-describedby="food-details-description"
                    >
                        <div className="modal-content">
                            <h2 id="food-details-title" className="modal-header">{selectedFood.name}</h2>
                            <div className="modal-body">
                                <p>Calories: {selectedFood.calories}</p>
                                <p>Serving Size: {selectedFood.serving_size_g} serving</p>
                                <p>Fat: {selectedFood.fat_total_g} g</p>
                                <p>Protein: {selectedFood.protein_g} g</p>
                                <p>Carbohydrates: {selectedFood.carbohydrates_total_g} g</p>

                                <div className="mt-4">
                                    <label className="block mb-2">Adjust Serving Size:</label>
                                    <input
                                        type="number"
                                        value={servingSize}
                                        onChange={(e) => setServingSize(e.target.valueAsNumber)}
                                        className="border border-gray-300 p-2 rounded w-full placeholder-gray-400"
                                        min="0.1" // Minimum serving size
                                        step="0.1" // Allow decimal inputs
                                        placeholder={selectedFood.servingSize}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={closeViewModal}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={()=> {
                                        handleServingSizeChange(selectedFood.id,servingSize);
                                        closeViewModal();
                                    }}
                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Modal for editing food goals */}
                {(modalType === "Edit Goals") && modalIsOpen && (
                    <Modal
                        open={modalIsOpen}
                        onClose={closeEditGoalModal}
                        aria-labelledby="food-details-title"
                        aria-describedby="food-details-description"
                    >
                        <div className="modal-content">
                                <div className="modal-body">
                                    <div className="mt-2">
                                        <h1 className="text-xl  font-bold">{"Edit Food Goals"}</h1>
                                        <label className="block mb-2 mt-5">Calorie Goal: </label>
                                        <input
                                            type="number"
                                            value={calorieGoal}
                                            onChange={(e) => setCalorieGoal(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="1" // Minimum serving size
                                            step="1" // Allow decimal inputs
                                        />
                                        <label className="block mb-2">Protein Goal:</label>
                                        <input
                                            type="number"
                                            value={proteinGoal}
                                            onChange={(e) => setProteinGoal(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="1" // Minimum serving size
                                            step="1" // Allow decimal inputs
                                        />

                                        <label className="block mb-2">Carbohydrates Goal:</label>
                                        <input
                                            type="number"
                                            value={carbGoal}
                                            onChange={(e) => setCarbGoal(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="0" // Minimum serving size
                                            step="0.1" // Allow decimal inputs
                                        />
                                        <label className="block mb-2">Fat Goal:</label>
                                        <input
                                            type="number"
                                            value={fatGoal}
                                            onChange={(e) => setFatGoal(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="0" // Minimum serving size
                                            step="0.1" // Allow decimal inputs
                                        />
                                        <label className="block mb-2">Step Goal:</label>
                                        <input
                                            type="number"
                                            value={stepGoal}
                                            onChange={(e) => setStepGoal(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="0" // Minimum serving size
                                            step="0.1" // Allow decimal inputs
                                        />
                                    </div>
                                </div>
                            <div className="modal-footer">
                                <button
                                    onClick={(e) => {
                                        handleEditGoalSubmit(e)
                                        closeEditGoalModal()
                                    }}

                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={closeEditGoalModal}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                    </Modal>
                )}
            </div>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default CalorieTracker;




