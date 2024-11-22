package com.fitnessapp.FitnessApp.dto;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;

@Data
@Builder
public class DailyStepsDTO {


    private DayOfWeek dayOfWeek;
    private long dailySteps;


}
