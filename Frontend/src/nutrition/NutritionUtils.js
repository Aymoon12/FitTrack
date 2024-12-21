export const workoutSplits = () => {

    let workoutDetails = {
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

    return workoutDetails
}

export const workoutDescrip = () => {

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

    return workoutDescriptions
}
