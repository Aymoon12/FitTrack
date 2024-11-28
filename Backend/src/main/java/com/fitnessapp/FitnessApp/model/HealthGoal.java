package com.fitnessapp.FitnessApp.model;

import java.util.Objects;

public enum HealthGoal {

    GAIN_WEIGHT,
    LOSE_WEIGHT,
    LOSE_WEIGHT_GAIN_MUSCLE,
    GAIN_WEIGHT_GAIN_MUSCLE,
    MAINTAIN_WEIGHT_GAIN_MUSCLE;

    public static HealthGoal fromString(String healthGoal){
        if(Objects.equals(healthGoal, "Gain weight"))
            return GAIN_WEIGHT;
        else if(Objects.equals(healthGoal, "Lose weight"))
            return LOSE_WEIGHT;
        else if(Objects.equals(healthGoal, "Lose weight gain muscle"))
            return LOSE_WEIGHT_GAIN_MUSCLE;
        else if(Objects.equals(healthGoal, "Gain weight and gain muscle"))
            return GAIN_WEIGHT_GAIN_MUSCLE;

        return MAINTAIN_WEIGHT_GAIN_MUSCLE;


    }
}
