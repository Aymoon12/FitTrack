package com.fitnessapp.FitnessApp.model;

import lombok.Builder;
import lombok.Data;


@Builder
@Data
public class AchievementsResponse {
    private Long mostSteps;
    private Long longestStreak;

}
