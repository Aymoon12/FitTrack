package com.fitnessapp.FitnessApp.service;


import com.fitnessapp.FitnessApp.model.CustomFood;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.repository.CustomFoodRepository;
import com.fitnessapp.FitnessApp.requests.CustomFoodRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomFoodService {

	private final CustomFoodRepository customFoodRepository;


	public CustomFood addFood(CustomFoodRequest customFoodRequest) {
		CustomFood customFood =  CustomFood.builder()
				.user_id(customFoodRequest.getUser_id())
				.name(customFoodRequest.getFood_name())
				.calories(customFoodRequest.getCalories())
				.fat_total_g(customFoodRequest.getFat_total_g() == null ? 0 : customFoodRequest.getFat_total_g())
				.serving_size_g(customFoodRequest.getServing_size_g())
				.protein_g(customFoodRequest.getProtein_g() == null ? 0 : customFoodRequest.getProtein_g())
				.sodium_mg(customFoodRequest.getSodium_mg() == null ? 0 : customFoodRequest.getSodium_mg())
				.potassium_mg(customFoodRequest.getPotassium_mg() == null ? 0 : customFoodRequest.getPotassium_mg())
				.cholesterol_mg(customFoodRequest.getCholesterol_mg() == null ? 0 : customFoodRequest.getCholesterol_mg())
				.carbohydrates_total_g(customFoodRequest.getCarbohydrates_total_g() == null ? 0 : customFoodRequest.getCarbohydrates_total_g())
				.fiber_g(customFoodRequest.getFiber_g() == null ? 0 : customFoodRequest.getFiber_g())
				.sugar_g(customFoodRequest.getSugar_g() == null ? 0 : customFoodRequest.getSugar_g())
				.servings(1.0)
				.build();
		return customFoodRepository.save(customFood);


	}


	public Response editFoodByID(CustomFoodRequest customFood, Long id) {
		return null;
	}

	public List<CustomFood> findFoodByNameAndUserId(Long user_id,
													String food_name) {
		return customFoodRepository.findAllByNameAndUserID(food_name,user_id).orElse(null);
	}
}
