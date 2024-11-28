package com.fitnessapp.FitnessApp.model;


public enum ActivityLevel {

    LOW,
    MODERATE,
    HIGH;

    public static ActivityLevel fromString(String activityLevel ) {
        if(activityLevel.equals("Low"))
            return LOW;
        else if(activityLevel.equals("Moderate"))
            return MODERATE;
       return HIGH;
    }


}
