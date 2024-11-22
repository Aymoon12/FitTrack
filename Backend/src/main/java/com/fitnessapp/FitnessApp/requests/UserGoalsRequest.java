package com.fitnessapp.FitnessApp.requests;

import lombok.Data;

@Data
public class UserGoalsRequest {

	private Long user_id;
	private Long goalCalories;
	private Long goalProtein;
	private Long goalCarbohydrates;
	private Long goalFats;
	private Long goalSteps;
}
