package com.fitnessapp.FitnessApp.requests;


import lombok.Data;

@Data
public class CustomFoodRequest {

	private Long user_id;
	private String food_name;
	private Double calories;
	private Double carbohydrates_total_g;
	private Double fat_total_g;
	private Double serving_size_g;
	private Double protein_g;
	private Double sodium_mg;
	private Double potassium_mg;
	private Double cholesterol_mg;
	private Double fiber_g;
	private Double sugar_g;

}
