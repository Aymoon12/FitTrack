import React, { useCallback, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar } from "@mui/material";
import Navbar from "../dashboard/Navbar";
import { getToken, getUser } from '../utils';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";

const WorkoutLogger = () => {
    const [workout, setWorkout] = useState({ name: '', sets: '', reps: '', weight: '' });
    const [workouts, setWorkouts] = useState([]);
    const [date, setDate] = useState(
        new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    );
    const token = getToken();
    const user = getUser();
    const navigate = useNavigate()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkout({ ...workout, [name]: value });
    };

    const fetchWorkouts = useCallback(async () => {
        try {
            const response   = await axios.get("http://18.220.193.103:8080/api/v1/workout/getAllWorkoutsByDate", {
                params: {
                    user_id: user.id,
                    date: date,
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setWorkouts(response.data);
            }
        } catch (e) {
            console.log(e);
        }
    }, [date, token, user.id]);

    // Fetch workouts only on initial load
    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const workoutRequest = {
            user_id: user.id,
            date_added: date,
            reps: workout.reps,
            sets: workout.sets,
            weight_lbs: workout.weight,
            workout_name: workout.name,
        };

        try {
            const response = await axios.post('http://18.220.193.103:8080/api/v1/workout/addWorkout', workoutRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 202) {
                toast.success("Workout logged!");
                await fetchWorkouts(); // Fetch workouts again after logging
                setWorkout('')
            }
        } catch (e) {
            toast.error(e.message); // Corrected to show error message
        }
    };

    const handleDelete = async (id) => {

        try{

            const response  = await axios.delete('http://18.220.193.103:8080/api/v1/workout/deleteWorkout', {
                params: {
                    workout_id: id,
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }

            })
           toast.success(response.data)
            await fetchWorkouts();
        } catch(e){
            console.log(e.message)
        }
    }

    const calculateTotalVolume = (sets, reps, weight) => {
        return sets * reps * weight;
    };

    const handleDateChange = async (e) => {
        setDate(e.target.value);
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });

    const handleRecommend = () => {
        navigate(`/recommendations/?date=${date}`)
    }

    const handleBackButton = () => {
        navigate("/dashboard")
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar/>
            </AppBar>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Workout Logger</h2>
                <form className="mb-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Select Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            className="border border-gray-300 p-2 rounded mb-4 w-full"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={workout.name}
                            onChange={handleChange}
                            placeholder="Workout Name"
                            className="border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="sets"
                            value={workout.sets}
                            onChange={handleChange}
                            placeholder="Sets"
                            className="border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="reps"
                            value={workout.reps}
                            onChange={handleChange}
                            placeholder="Reps"
                            className="border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="weight"
                            value={workout.weight}
                            onChange={handleChange}
                            placeholder="Weight (lbs)"
                            className="border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Log Workout
                        </button>
                    </div>

                </form>


                {/* Logged Workouts */}
                <h3 className="text-xl font-semibold mb-2">Logged Workouts</h3>
                <ul className="space-y-4">
                    {workouts.map((workout, index) => (
                        <li key={index} className="border-b pb-2">
                            <div className="flex justify-between">
                                <span>{workout.workout_name}</span>
                                <span>
                                    {workout.sets} sets × {workout.reps} reps × {workout.weight_lbs} lbs
                                </span>
                                <button
                                    onClick={() => handleDelete(workout.id)}
                                    className="bg-red-500 text-white font-semibold py-1 px-2 border border-red-500 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Volume: {calculateTotalVolume(workout.sets, workout.reps, workout.weight_lbs)} lbs
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between">
                <button
                    onClick={handleRecommend}
                    className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Log From Recommendations
                </button>

                <button
                    onClick={handleBackButton}
                    className="bg-blue-500 mt-5 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700">
                    Back
                </button>
                </div>
            </div>

            <ToastContainer/>
        </ThemeProvider>
    );
};

export default WorkoutLogger;


