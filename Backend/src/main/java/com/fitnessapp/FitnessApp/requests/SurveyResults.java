package com.fitnessapp.FitnessApp.requests;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class SurveyResults {

    private Long age;
    private Double weight;
    private String activity;
    private String goal;

}
