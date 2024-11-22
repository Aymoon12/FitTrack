// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from '../workouts/WorkoutSlice';

export const store = configureStore({
    reducer: {
        workouts: workoutReducer,
    },
});
