import './App.css';
import SignInSide from "./login/SignInSide";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FitnessDashboard from "./dashboard/FitnessDashboard";
import ForgotPassword from "./login/ForgotPassword";
import SignUp from "./login/SignUp";
import CalorieTracker from "./calorietracker/CalorieTracker";
import FoodSearch from "./calorietracker/FoodSearch";
import WorkoutLogger from "./workouts/WorkoutLogger";
import { Provider } from 'react-redux';
import { store } from './reduxstore/store';
import WorkoutRecommendation from './workouts/WorkoutRecommendation';
import UserProfile from "./user/UserProfile";

function App() {

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<SignInSide />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<FitnessDashboard />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/trackcalories" element={<CalorieTracker />} />
                    <Route path="/search" element={<FoodSearch />} />
                    <Route path="/workouts" element={<WorkoutLogger />} />
                    <Route path="/recommendations" element={<WorkoutRecommendation />} />
                    <Route path="/settings" element={<UserProfile/>} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;

