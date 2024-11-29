package com.fitnessapp.FitnessApp.model;


public enum ActivityLevel {

    LOW,
    MODERATE,
    HIGH;

    public static ActivityLevel fromString(String activityLevel ) {
        if(activityLevel.equals("low"))
            return LOW;
        else if(activityLevel.equals("moderate"))
            return MODERATE;
       return HIGH;
    }


}
