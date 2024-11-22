package com.fitnessapp.FitnessApp.model;

import lombok.Getter;


@Getter
public enum MealType {

	BREAKFAST,
	LUNCH,
	DINNER,
	SNACK;

	public static MealType getMealType(String mealType){
		if (mealType == null){
			return null;
		}
		return switch (mealType) {
			case "Breakfast" -> MealType.BREAKFAST;
			case "Lunch" -> MealType.LUNCH;
			case "Dinner" -> MealType.DINNER;
			default -> MealType.SNACK;
		};
	}

}
