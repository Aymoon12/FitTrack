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
    const [macros, setMacros] = useState([])
    const [date, setDate] = useState(
        new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    );
    const [protein, setProtein] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fat, setFat] = useState(0)

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
    const [proteinGoal, setProteinGoal] = useState('')
    const [fatGoal, setFatGoal] = useState('')
    const [carbGoal, setCarbGoal] = useState('')


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
                data: [Math.ceil(macros[0]), calorieGoal - Math.ceil(macros[0])],
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
          else{
              setCalorieGoal(response.data.goalCalories)
              setFatGoal(response.data.goalFats)
              setProteinGoal(response.data.goalProtein)
              setCarbGoal(response.data.goalCarbohydrates)
          }





            const getMacros = await axios.get("http://localhost:8080/api/v1/food/getCalories",{
                params:{
                    user_id: user_id,
                    date: date
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            setMacros(getMacros.data[0])
            console.log(macros[0] == null)



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
                setStreak(user.streak)



            }
            )
            .then(getSteps)
            .finally(() => {

                console.log(stepsData)
                setLoading(false)
              })



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
                            {greeting}, {userName}!
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
                                        <Typography variant="h4">{Math.ceil(macros[0])}/{calorieGoal}</Typography>
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
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" sx={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                                                    🔥
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" className="text-blue-600">
                                                Calories Consumed vs Goal
                                            </Typography>
                                        </Box>

                                        {/* Pie Chart */}
                                        <Box sx={{ height: 200 }}>
                                            <Pie data={pieData} options={chartOptions} />
                                        </Box>
                                    </CardContent>

                                    {/* Button */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            backgroundColor: '#f3f4f6',
                                            borderTop: '1px solid #e0e0e0',
                                            borderRadius: '0 0 8px 8px',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                        >
                                            Log Calories
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Bar Chart for Steps */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" sx={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                                                    🚶
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" className="text-blue-600">
                                                Steps This Week
                                            </Typography>
                                        </Box>

                                        {/* Bar Chart */}
                                        <Box sx={{ height: 200 }}>
                                            <Bar data={barData} options={chartOptions} />
                                        </Box>
                                    </CardContent>

                                    {/* Button */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            backgroundColor: '#f3f4f6',
                                            borderTop: '1px solid #e0e0e0',
                                            borderRadius: '0 0 8px 8px',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                        >
                                            Log Steps
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                {/* Today's Ongoing Goals Section */}
                                <Card
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    sx={{
                                        minHeight: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 4,
                                    }}
                                >
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography
                                                    sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}
                                                >
                                                    🎯
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" className="text-blue-600">
                                                Today's Ongoing Goals
                                            </Typography>
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">Protein</Typography>
                                            <Box sx={{ backgroundColor: '#e0e0e0', borderRadius: 2, height: 8 }}>
                                                <Box
                                                    sx={{
                                                        width: `${Math.ceil((macros[1]/proteinGoal) * 100)}%`,
                                                        backgroundColor: '#1976d2',
                                                        height: '100%',
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption">{Math.ceil(macros[1])} / {proteinGoal}g</Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">Carbohydrates</Typography>
                                            <Box sx={{ backgroundColor: '#e0e0e0', borderRadius: 2, height: 8 }}>
                                                <Box
                                                    sx={{
                                                        width: `${Math.ceil((macros[2]/carbGoal) * 100)}%`,
                                                        backgroundColor: '#1976d2',
                                                        height: '100%',
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption">{Math.ceil(macros[2])} / {carbGoal}g</Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">Fat</Typography>
                                            <Box sx={{ backgroundColor: '#e0e0e0', borderRadius: 2, height: 8 }}>
                                                <Box
                                                    sx={{
                                                        width: `${Math.ceil((macros[3]/fatGoal) * 100)}%`,
                                                        backgroundColor: '#1976d2',
                                                        height: '100%',
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption">{Math.ceil(macros[3])} / {fatGoal}g</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                {/* Achievements Section */}
                                <Card
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    sx={{
                                        minHeight: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 4,
                                    }}
                                >
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography
                                                    sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}
                                                >
                                                    🏆
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" className="text-blue-600">
                                                Achievements
                                            </Typography>
                                        </Box>

                                        {/* Content */}
                                        <Typography variant="body2" color="text.secondary">
                                            - Longest Streak: 10 days
                                            <br />
                                            - Most Steps in a Day: 15,000 steps
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                        </Grid>
                    </Box>

                    <Box sx={{ mb: 4 }} className="p-4">
                        <Typography variant="h6" align="center" gutterBottom className="text-blue-600 mt-20">
                            Your Fitness Insights
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {/* Log Your Workouts */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                                                    🏋️
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" className="text-blue-600">
                                                Log Your Workouts
                                            </Typography>
                                        </Box>

                                        {/* Description */}
                                        <Typography variant="body2" color="text.secondary">
                                            Keep track of your workouts and monitor your performance.
                                        </Typography>

                                        {/* Button */}
                                        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                            >
                                                Log Workout
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Nutrition Tips */}
                            <Grid item xs={12} md={6}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        {/* Title with Icon */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                                                    🥗
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" className="text-blue-600">
                                                Nutrition Tips
                                            </Typography>
                                        </Box>

                                        {/* Description */}
                                        <Typography variant="body2" color="text.secondary">
                                            Get personalized nutrition tips to enhance your fitness journey.
                                        </Typography>

                                        {/* Button */}
                                        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                                            >
                                                Get Tips
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>


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




