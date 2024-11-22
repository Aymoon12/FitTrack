package com.fitnessapp.FitnessApp.requests;

import lombok.Data;

@Data
public class CustomFoodSearchRequest {

	private Long user_id;
	private String food_name;
}
