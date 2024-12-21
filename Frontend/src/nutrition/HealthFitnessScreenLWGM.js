import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Modal, Box, Link } from "@mui/material";
import {workoutSplits,workoutDescrip} from "./NutritionUtils.js"

const workoutDescriptions = workoutDescrip()

const workoutDetails = workoutSplits()

const HealthFitnessScreen = () => {
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const handleOpen = (workout) => setSelectedWorkout(workout);
    const handleClose = () => setSelectedWorkout(null);

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-6">
            <Card className="w-full max-w-4xl shadow-lg">
                <CardContent className="flex flex-col gap-6">
                    <Typography
                        variant="h4"
                        className="text-blue-700 font-bold text-center"
                    >
                        Your Personalized Health & Fitness Plan
                    </Typography>

                    {/* Diet Recommendations */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <Typography variant="h5" className="text-blue-600 font-semibold">
                            Diet Recommendations
                        </Typography>
                        <Typography variant="body1" className="text-gray-700 mt-2">
                            To lose weight and gain muscle, focus on a balanced diet rich in
                            protein, healthy fats, and complex carbohydrates. Include foods
                            like chicken breast, eggs, quinoa, sweet potatoes, and leafy
                            greens.
                        </Typography>
                        <ul className="list-disc list-inside mt-4 text-gray-700">
                            <li>Consume 1.2-2.0 grams of protein per kg of body weight.</li>
                            <li>Avoid processed and sugary foods.</li>
                            <li>Drink plenty of water and stay hydrated.</li>
                        </ul>
                        <Link
                            href="https://www.healthline.com/nutrition/muscle-gain-diet"
                            target="_blank"
                            className="block mt-4 text-blue-500 hover:underline"
                        >
                            Read more about muscle gain diets
                        </Link>
                    </div>

                    {/* Workout Recommendations */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <Typography variant="h5" className="text-blue-600 font-semibold">
                            Workout Recommendations
                        </Typography>
                        <Typography variant="body1" className="text-gray-700 mt-2">
                            Choose a workout split that fits your schedule and goals. Click
                            "View" for detailed workout plans:
                        </Typography>
                        <div className="mt-4 space-y-4">
                            {Object.keys(workoutDetails).map((split) => (
                                <div
                                    key={split}
                                    className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
                                >
                                    <Typography variant="body1" className="text-gray-700">
                                        {split}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpen(split)}
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <Typography variant="h5" className="text-blue-600 font-semibold">
                            Useful Resources
                        </Typography>
                        <Typography variant="body1" className="text-gray-700 mt-2">
                            Explore the following articles and studies:
                        </Typography>
                        <ul className="list-disc list-inside mt-4 text-blue-500">
                            <li>
                                <Link
                                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/"
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    Effects of Diet and Exercise on Muscle Growth
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://www.jissn.com/"
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    Journal of the International Society of Sports Nutrition
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://examine.com/"
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    Evidence-Based Supplement and Fitness Insights
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Modal for Workout Details */}
                    <Modal open={!!selectedWorkout} onClose={handleClose}>
                        <Box
                            className="bg-white p-6 rounded-md shadow-lg mx-auto"
                            style={{
                                maxWidth: 600,
                                width: "90%",
                                maxHeight: "80vh",
                                margin: "auto",
                                overflowY: "auto",
                                position: "relative",
                                top: "10%",
                                outline: "none",
                            }}
                        >
                            <Typography
                                variant="h4"
                                className="text-blue-600 font-semibold text-center"
                            >
                                {selectedWorkout} Details
                            </Typography>
                            <Typography
                                variant="h6"
                                className="text-black-300 font-bold text-left"
                            >
                                Description
                            </Typography>

                            {selectedWorkout && workoutDescriptions[selectedWorkout]?.map((item, index) => (
                                <Typography
                                    key={index}
                                    variant="body1"
                                    color="black"
                                    sx={{ marginTop: "8px" }}
                                >
                                    {item.description}
                                </Typography>
                            ))}
                            {selectedWorkout &&
                                workoutDetails[selectedWorkout].map((day, index) => (
                                    <div key={index} className="mt-6">
                                        <Typography
                                            variant="h6"
                                            className="text-black-700 font-medium"
                                        >
                                            {day.day}
                                        </Typography>
                                        <table className="w-full mt-4 border-collapse border border-gray-200">
                                            <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Exercise
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Sets
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Reps
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Rest
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {day.exercises.map((exercise, idx) => (
                                                <tr key={idx}>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {exercise.name}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {exercise.sets}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {exercise.reps}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {exercise.rest}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            <div className="mt-10"></div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClose}
                                className="mt-20 block mx-auto"
                            >
                                Close
                            </Button>
                        </Box>
                    </Modal>
                </CardContent>
            </Card>
        </div>
    );
};

export default HealthFitnessScreen;




