// src/components/WorkoutRecommendation.js

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkouts, selectWorkouts } from './WorkoutSlice';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {AppBar, Modal} from "@mui/material";
import Navbar from "../dashboard/Navbar";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {getUser,getToken} from "../utils";
import 'react-toastify/dist/ReactToastify.css'
import {useNavigate} from "react-router-dom";


const muscleGroups = [
    'chest',
    'back',
    'legs',
    'arms',
    'shoulders',
];

const WorkoutRecommendation = () => {
    const dispatch = useDispatch();
    const workouts = useSelector(selectWorkouts);
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState('')
    const user = getUser()
    const token = getToken()
    const [date,setDate] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        if (selectedMuscle) {
            dispatch(fetchWorkouts(selectedMuscle));

            const params = new URLSearchParams(window.location.search);
            const d = params.get('date');
            setDate(d);
        }
    }, [selectedMuscle, dispatch]);


    useEffect(() => {
        if (workouts && workouts.length > 0) {
            setSelectedMuscle(workouts[0].muscleGroup);
        }
    }, [workouts]);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });

    const [reps,setReps] = useState('')
    const [sets,setSets] = useState('')
    const [weight,setWeight] = useState('')
    const [image, setImage] = useState('')



    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedWorkout(null);
        setReps('');
        setSets('');
        setWeight('');
        setImage('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const workoutRequest = {
            user_id: user.id,
            date_added: date,
            reps: reps,
            sets: sets,
            weight_lbs: weight,
            workout_name: selectedWorkout,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/v1/workout/addWorkout', workoutRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 202) {
                toast.success("Workout logged!");
                await fetchWorkouts(); // Fetch workouts again after logging
            }
        } catch (e) {
            toast.error(e.message); // Corrected to show error message
        }
    };
    const styles = theme => ({
        modalStyle1:{
            position:'absolute',
            top:'10%',
            left:'10%',
            overflow:'scroll',
            height:'50%',
            display:'block'
        }
    });

    const handleBackButton = () => {

        navigate("/workouts")
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>

            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

                <h2 className="text-2xl font-bold mb-4">Workout Recommendations</h2>
                <div className="mb-4">
                    <label htmlFor="muscleGroup" className="block mb-2">Select Muscle Group:</label>
                    <select
                        id="muscleGroup"
                        value={selectedMuscle}
                        onChange={(e) => setSelectedMuscle(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                    >
                        <option value="">-- Select a Muscle Group --</option>
                        {muscleGroups.map((muscle) => (
                            <option key={muscle} value={muscle}>{muscle}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="border square p-4 h-64 flex flex-col"> {/* Container */}
                            <h3 className="font-semibold">{workout.name}</h3>
                            <div
                                className="flex-grow flex items-center justify-center overflow-hidden"> {/* Center and hide overflow, any part of image that overflows will be hidden */}
                                <img
                                    src={workout.pictureURL}
                                    alt={workout.name}
                                    className="w-full h-full object-contain"/> {/* Use object-contain, scales down the image to make sure it fits container and maintains aspect ration */}
                            </div>
                            <p className="mt-2">{workout.description}</p>
                            <button
                                onClick={() => {
                                    setImage(workout.pictureURL)
                                    setSelectedWorkout(workout.name)
                                    openModal()
                                }}
                                className="bg-blue-500 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700">
                                Add
                            </button>
                        </div>
                    ))}
                </div>
                {/* Modal for workouts */}
                {selectedWorkout && modalIsOpen && (
                    <Modal
                        open={modalIsOpen}
                        onClose={closeModal}
                        aria-labelledby="food-details-title"
                        aria-describedby="food-details-description"
                        sx={{overflowY: 'scroll'}} disableScrollLock={false}
                    >
                        <div className="modal-content">
                            <div className={styles.modalStyle1}>
                                <div className="modal-body">
                                    <div className="mt-2">
                                        <h1 className="font-semibold">{selectedWorkout}</h1>
                                        <img
                                            src={image}
                                            alt={selectedWorkout}
                                            className="w-full h-22 object-contain"/>
                                        <label className="block mb-2">Sets:</label>
                                        <input
                                            type="number"
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="1" // Minimum serving size
                                            step="1" // Allow decimal inputs
                                        />
                                        <label className="block mb-2">Reps:</label>
                                        <input
                                            type="number"
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                            className="border border-gray-300 p-2 rounded w-full"
                                            min="1" // Minimum serving size
                                            step="1" // Allow decimal inputs
                                        />
                                    </div>
                                    <label className="block mb-2">Weight:</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0" // Minimum serving size
                                        step="0.1" // Allow decimal inputs
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        onClick={(e) => {
                                            handleSubmit(e).finally(closeModal)
                                        }}

                                        className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                    >
                                        Add to Log
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="flex justify-end">
                <button
                    onClick={handleBackButton}
                    className="bg-blue-500 mt-10 text-white font-semibold py-1 px-2 border border-blue-500 rounded hover:bg-blue-700 ">
                    Back
                </button>
                </div>

            </div>
            <ToastContainer/>
        </ThemeProvider>

    );
};

export default WorkoutRecommendation;
