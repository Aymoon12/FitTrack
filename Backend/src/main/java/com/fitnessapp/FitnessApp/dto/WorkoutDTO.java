package com.fitnessapp.FitnessApp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WorkoutDTO {

	private Long user_id;
	private String date_added;
	private Long reps;
	private Long sets;
	private Double weight_lbs;
	private String workout_name;


}
