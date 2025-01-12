package com.fitnessapp.FitnessApp.dto;

import com.fitnessapp.FitnessApp.model.UserGoals;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class UserGoalsAndMetricsDTO {
    private UserGoals userGoals;
    private List<Long> metrics;


    public UserGoalsAndMetricsDTO(UserGoals userGoals, List<Long> metrics) {
        this.userGoals = userGoals;
        this.metrics = metrics;
    }


}
