import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Modal, Box, Link } from "@mui/material";

const workoutDescriptions = {
    "Bro Split": [
        {
            description: "The Bro Split focuses on training one major muscle group per day. It is ideal for those aiming to isolate and intensely work on specific muscle groups." +
                "\nThis split is recommened to beginners as newbie gains are in full affect so frequent stiminulation of muscle in a small time frame can be benefical." +
                "\n The sequence for this split should be followed as Chest Back Legs Shoulders Arms Rest Rest and repeat. This is a 7 day cycle."

        },
    ],
    "Push/Pull/Legs": [
        {
            description: "Push-Pull-Legs is a versatile split and one of the most, if not the most popular spit." +
                "\nIt is great for balanced full-body development. This split allows for adequate time for stimulated muscle to rest and be repeated on the next cycle." +
                "The sequenece of this split should be follow as Push Pull Legs Rest and repeat. This is a 4 day cycle.",
        },
    ],
    "Upper/Lower": [
        {
            description: "The Upper/Lower split alternates between upper-body and lower-body workouts. Efficient for recovery and balanced strength building." +
                "This split in recent light has been shown to be the best split for hypertrophy (muscle growth). This split emphasizes the importance of frequent " +
                "and intense workouts leading to a optimal approach to bodybuilding. This split is also very favorable to indivuals who can only workout 4 times a week, with" +
                "sessions only lasting 45 minutes to 1 hour. The sequence of this split should be followed as Upper Lower Rest Upper Lower Rest Rest and repeat. This is " +
                "a 7 day cycle.",
        },
    ],
};

const workoutDetails = {
    "Bro Split": [
        {
            day: "Day 1: Chest Day",
            exercises: [
                { name: "Incline Dumbbell Press", sets: "4", reps: "5-8", rest: "4 min" },
                { name: "Chest Flys", sets: "4", reps: "10-12", rest: "2 min" },
                { name: "Tricp Pushdowns", sets: "3", reps: "8-12", rest: "2 min" },
                { name: "Dips", sets: 3, reps: "10-12", rest: "2 min" },
            ],
        },
        {
            day: "Day 2: Back Day",
            exercises: [
                { name: "Barbell Rows", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Seated Cable Rows", sets: 3, reps: "8", rest: "2 min" },
                { name: "Preacher Curls", sets: 3, reps: "10", rest: "2 min" },
                { name: "Lat Pulldowns", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Incline Curls", sets: 3, reps: "10", rest: "2 min" },
            ],
        },
        {
            day: "Day 3: Leg Day",
            exercises: [
                { name: "Hamstring Curls", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Leg Press", sets: 2, reps: 7, rest: "5 min" },
                { name: "Seated Adduction Machine", sets: 3, reps: 10, rest: "2 min" },
                { name: "Calf Raises", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Leg Extensions", sets: 3, reps: 10, rest: "2 min" },
            ],
        },
        {
            day: "Day 4: Shoulder Day",
            exercises: [
                { name: "Incline Chest Machine Press", sets: 3, reps: 8-10, rest: "3 min" },
                { name: "Shoulder Press", sets: 2, reps: "7-10", rest: "3 min" },
                { name: "Front Raises", sets: 3, reps: 10, rest: "2 min" },
                { name: "Laterial Raises", sets: 3, reps: "8-10", rest: "2 min" },
            ],
        },
        {
            day: "Day 5: Arm Day",
            exercises: [
                { name: "Chin Ups", sets: 2, reps: "8-10", rest: "2 min" },
                { name: "Tricep Pushdowns", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Dumbbell Hammer Curls", sets: 3, reps: 10, rest: "2 min" },
                { name: "Overhead Dumbbell Tricep Extensions", sets: 3, reps: 8-10, rest: "2 min" },
            ],
        },

    ],
    "Push/Pull/Legs": [
        {
            day: "Push",
            exercises: [
                { name: "Incline Machine Chest Press", sets: 3, reps: 8, rest: "4 min" },
                { name: "Tricep Pushdowns", sets: 3, reps: 10, rest: "2 min" },
                { name: "Shoulder Press", sets: 3, reps: "8-10", rest: "3 min" },
                { name: "Chest Flys", sets: 3, reps: 10, rest: "2 min" },
                { name: "Lateral Raises", sets: 3, reps: "8-12", rest: "2 min" },
                { name: "Dips", sets: 3, reps: 10, rest: "3 min" },
            ],
        },
        {
            day: "Pull",
            exercises: [
                { name: "Machine Back Rows", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Lat Pulldowns", sets: 3, reps: 10, rest: "2 min" },
                { name: "Preacher Curls", sets: 3, reps: 10, rest: "60s" },
                { name: "Machine Rear Delt Flys", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Dumbbell Curls", sets: 3, reps: 8, rest: "2 min" },
            ],
        },
        {
            day: "Legs",
            exercises: [
                { name: "Hamstring Curls", sets: 2, reps: "8-10", rest: "3 min" },
                { name: "Hack Squat", sets: 2, reps: 7, rest: "5 min" },
                { name: "Seated Adduction Machine", sets: 3, reps: 10, rest: "3 min" },
                { name: "Calf Raises", sets: 3, reps: "8-10", rest: "3 min" },
                { name: "Leg Extensions", sets: 3, reps: 10, rest: "3 min" },
            ],
        },
    ],
    "Upper/Lower": [
        {
            day: "Upper Body",
            exercises: [
                { name: "Incline Machine Chest Press", sets: 2, reps: "5-8", rest: "3 min" },
                { name: "Seated Machine Rows", sets: 2, reps: "5-8", rest: "3 min" },
                { name: "Unilateral Tricep Pushdowns", sets: 2, reps: "5-9", rest: "3 min" },
                { name: "Cable Laterial Raises", sets: 2, reps: "5-8", rest: "3 min" },
                { name: "Preacher Curls", sets: 2, reps: "5-9", rest: "3 min" },
            ]
        },
        {
            day: "Lower Body",
            exercises: [
                { name: "Seated Hamstring Curls", sets: 2, reps: "5-8", rest: "3 min" },
                { name: "Hack Squat", sets: 2, reps: "4-7", rest: "5 min" },
                { name: "Calf Raises", sets: 2, reps: "5-10", rest: "3 min" },
                { name: "Bilaterial Leg Extensions", sets: 1, reps: "5-10", rest: "3 min" },
            ],

        },
    ],
};

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




