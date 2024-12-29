// src/features/workoutSlice.js

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {getToken, getUser} from "../utils";

import {LOGOUT} from "../dashboard/Navbar"

export const fetchWorkouts = createAsyncThunk(
    'workouts/fetchWorkouts',
    async (muscleGroup) => {
        const user = getUser()
        console.log(muscleGroup)
        console.log(user)
        const token = getToken()
        const response = await axios.get('http://localhost:8080/api/v1/s3/getWorkout', {
            params: {
                muscleGroup: muscleGroup,
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })
        console.log(response)
        return await response.data;
    }
);

const workoutSlice = createSlice({
    name: 'workouts',
    initialState: {
        workouts: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkouts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWorkouts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched workouts to the array
                state.workouts = action.payload;
            })
            .addCase(fetchWorkouts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(LOGOUT, (state, action) => {
                state.workouts = [];
                state.status = 'idle';
                state.error = null;

        });
    },
});

export const selectWorkouts = (state) => state.workouts.workouts;
export default workoutSlice.reducer;
