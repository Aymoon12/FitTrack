import React, {useCallback, useEffect, useState} from 'react';
import {
    AppBar,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    Box, CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './Navbar';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import {getUser,getToken} from "../utils";
import axios from "axios";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue theme color
        },
    },
});

const FitnessDashboard = () => {
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState(
        new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    );

    const [caloriesConsumed, setCaloriesConsumed] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    let params = new URLSearchParams(window.location.search);

    const [mon, setMon] = useState(0)
    const [tues, setTues] = useState(0)
    const [wed, setWed] = useState(0)
    const [thur, setThur] = useState(0)
    const [fri, setFri] = useState(0)
    const [sat, setSat] = useState(0)
    const [sun, setSun] = useState(0)
    const stepsData = [mon, tues, wed, thur, fri, sat, sun];
    const user_id = params.get('userId') || getUser().id;
    const token = params.get('token') || getToken();
    const [calorieGoal, setCalorieGoal] = useState('')
    const hour = new Date().getHours();
    const [greeting, setGreeting] = useState('')
    const [userName, setUsername] = useState('')
    const [streak, setStreak] = useState('')



    let timeOfDay = (hour) => {
        if (hour < 12) {
            setGreeting('Good Morning');
        }
        else if(hour < 17){
            setGreeting('Good Afternoon')
        }
        else
            setGreeting('Good Evening')
    }

    // Pie Chart Data
    const pieData = {
        labels: ['Calories Consumed', 'Remaining Calories'],
        datasets: [
            {
                data: [caloriesConsumed, calorieGoal - caloriesConsumed],
                backgroundColor: ['#1976d2', '#f44336'],
                hoverBackgroundColor: ['#1565c0', '#e57373'],
            },
        ],
    };

    // Bar Chart Data
    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Steps Taken',
                data: stepsData,
                backgroundColor: '#1976d2',
                hoverBackgroundColor: '#1565c0',
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const getSteps = async () => {

        try{

            const response = await axios.get("http://localhost:8080/api/v1/cardio/getWeekSteps" ,{
                params:{
                    user_id: user_id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });


            const dailyStepsArray =
                Object.entries(response.data).map(([day, steps]) => [day, steps]);

            console.log(dailyStepsArray)





            for(let [key,value] of dailyStepsArray){

                if(key === "SUNDAY")
                    setSun(value)
                else if(key === "MONDAY")
                    setMon(value)
                else if(key === "TUESDAY")
                    setTues(value)
                else if(key === "WEDNESDAY")
                    setWed(value)
                else if(key === "THURSDAY")
                    setThur(value)
                else if(key === "FRIDAY")
                    setFri(value)
                else if(key === "SATURDAY")
                    setSat(value)

            }

        } catch (e){
            console.log(e.message)
        }
    }



    const getUserGoals =  async () => {

        try{

            const response = await axios.get("http://localhost:8080/api/v1/user/getUserGoals" ,{
                params:{
                    user_id: user_id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

          if(response.data.length === 0){
              setCalorieGoal(2000)
            }
            else
                setCalorieGoal(response.data.goalCalories)



            const getCalories = await axios.get("http://localhost:8080/api/v1/food/getCalories",{
                params:{
                    user_id: user_id,
                    date: date
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            setCaloriesConsumed(getCalories.data)

            if(localStorage.getItem('user') === null){
                try{

                    const response = await axios.get('http://localhost:8080/api/v1/user/getUser', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    let user = response.data;
                    localStorage.setItem('user', JSON.stringify(user))
                } catch (e){
                    console.log(e)
                }
            }
        } catch (e){
            console.log(e.message)
        }



    };


    useEffect( () => {
        setLoading(true)
        timeOfDay(hour)
        if(localStorage.getItem('token') == null)
            localStorage.setItem('token', token);


        getUserGoals()
            .then(() => {
                const user = getUser()
                setUsername(user.name.split(" ")[0])
                setStreak(user.streak)}
            )
            .then(getSteps)
            .finally(() => {
                console.log(stepsData)
                setLoading(false)})

    }, [hour, token]);

    return (

        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <Container>
                    {/* Welcome Banner */}
                    <Box sx={{ my: 4 }} className="p-4">
                        <Typography variant="h4" align="center" gutterBottom className="text-blue-800 font-bold">
                            {greeting}, {userName}! {/* Replace with actual user's name */}
                        </Typography>
                    </Box>

                    {/* Daily Overview Section */}
                    <Box sx={{ mb: 4 }} className="p-4">
                        <Typography variant="h6" align="center" gutterBottom className="text-blue-600">
                            Your Daily Overview
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={4}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        <Typography variant="h6" className="text-blue-600">Calories Consumed</Typography>
                                        <Typography variant="h4">{caloriesConsumed}/{calorieGoal}</Typography> {/* Example data */}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        <Typography variant="h6" className="text-blue-600">Workouts</Typography>
                                        <Typography variant="h4">45 mins</Typography> {/* Example data */}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        <Typography variant="h6" className="text-blue-600">Health Metrics</Typography>
                                        <Typography variant="h4">70%</Typography> {/* Example data */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Charts Section */}
                    <Box sx={{ mb: 4 }} className="p-4">
                        <Typography variant="h6" align="center" gutterBottom className="text-blue-600">
                            Your Progress
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {/* Pie Chart for Calories */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" sx={{ height: 300 }}>
                                    <CardContent>
                                        <Typography variant="h6" className="text-blue-600">Calories Consumed vs Goal</Typography>
                                        <Box sx={{ height: 200 }}>
                                            <Pie data={pieData} options={chartOptions} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Bar Chart for Steps */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" sx={{ height: 300 }}>
                                    <CardContent>
                                        <Typography variant="h6" className="text-blue-600">Steps This Week</Typography>
                                        <Box sx={{ height: 200 }}>
                                            <Bar data={barData} options={chartOptions} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Main Grid Sections */}
                    <Grid container spacing={4}>
                        {/* Track Your Calories */}
                        <Grid item xs={12} md={6}>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent>
                                    <Typography variant="h5" gutterBottom className="text-blue-600">
                                        Track Your Calories
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Log your daily calorie intake and track your progress.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                    >
                                        Log Calories
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Log Your Workouts */}
                        <Grid item xs={12} md={6}>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent>
                                    <Typography variant="h5" gutterBottom className="text-blue-600">
                                        Log Your Workouts
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Keep track of your workouts and monitor your performance.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                    >
                                        Log Workout
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Weekly Progress */}
                        <Grid item xs={12} md={6}>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent>
                                    <Typography variant="h5" gutterBottom className="text-blue-600">
                                        Weekly Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        View your progress over the week with charts and stats.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                    >
                                        View Progress
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Nutrition Tips */}
                        <Grid item xs={12} md={6}>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent>
                                    <Typography variant="h5" gutterBottom className="text-blue-600">
                                        Nutrition Tips
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Get personalized nutrition tips to enhance your fitness journey.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                    >
                                        Get Tips
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Motivational Section */}
                    <Box sx={{ mt: 4 }} className="p-4">
                        <Typography variant="h6" align="center" className="text-blue-600">
                            "Push harder than yesterday if you want a different tomorrow."
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary">
                            Streak: {streak} days
                        </Typography>
                    </Box>
                </Container>
            )}

        </ThemeProvider>
    );
};

export default FitnessDashboard;




