package com.fitnessapp.FitnessApp.service;

import com.fitnessapp.FitnessApp.model.Food;
import com.fitnessapp.FitnessApp.model.MealType;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.FoodRepository;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.requests.AddFoodRequest;
import com.fitnessapp.FitnessApp.requests.UpdateServingSizeRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@Data
public class FoodService {

	private final FoodRepository foodRepository;
	private final UserService userService;
	private final UserRepository userRepository;




	public Food addFood(AddFoodRequest foodRequest) {

		MealType mealType = MealType.getMealType(foodRequest.getMealType());
		LocalDate date = LocalDate.parse(foodRequest.getDate());


		Food food = Food.builder()
				.user_id(foodRequest.getUser_id())
				.calories(foodRequest.getCalories())
				.carbohydrates_total_g(foodRequest.getCarbohydrates_total_g())
				.cholesterol_mg(foodRequest.getCholesterol_mg())
				.date_added(date)
				.fat_total_g(foodRequest.getFat_total_g())
				.fiber_g(foodRequest.getFiber_g())
				.mealType(mealType)
				.name(foodRequest.getFood_name())
				.potassium_mg(foodRequest.getPotassium_mg())
				.protein_g(foodRequest.getProtein_g())
				.serving_size_g(foodRequest.getServing_size_g())
				.servings(foodRequest.getServings())
				.sodium_mg(foodRequest.getSodium_mg())
				.sugar_g(foodRequest.getSugar_g())
				.build();

		return foodRepository.save(food);

				
	}

	public List<Food> getMeals(HttpServletRequest request, String mealType) {

		User user = userService.userDtoToUser(userService.getUser(request));
		MealType meal = MealType.getMealType(mealType);
		return foodRepository.findByMealType(meal,user.getID()).orElse(null);


	}

	public Map<String, List<Food>> getAllMeals(Long userId, String date) {

		LocalDate date1 = LocalDate.parse(date);
		List<Food> foods = foodRepository.findByUserIdAndDate(userId,date1).orElseThrow(
				() -> new RuntimeException("No meals found!")
		);
		Map<String, List<Food>> meals = new HashMap<>();
		meals.put("breakfast", new ArrayList<>());
		meals.put("lunch", new ArrayList<>());
		meals.put("dinner", new ArrayList<>());
		meals.put("snack", new ArrayList<>());


		for(Food food : foods){
			String mealType = food.getMealType().toString().toLowerCase();
			if(meals.containsKey(mealType)){
				meals.get(mealType).add(food);
			}
		}
		return meals;
	}

	public Response deleteFoodByFoodId(Long foodId) {
		Food food = foodRepository.findByFoodId(foodId).orElseThrow(
				() -> new RuntimeException("No food found!"));

		foodRepository.delete(food);
		Response response = new Response();
		response.setMessage("Food deleted");
		return response;
	}

	public Food updateFoodServingSize(UpdateServingSizeRequest request) {

		Food food = foodRepository.findByFoodId(request.getFood_id()).orElseThrow(
				() -> new RuntimeException("No food found!")
		);

		food.setServings(request.getServingSize());
		return foodRepository.save(food);

	}


	public List<?> getMacrosByDateAndUserID(Long userId, String date) {

		LocalDate localDate = LocalDate.parse(date);

		if(userRepository.findUserById(userId).orElse(null) != null){
            return foodRepository.findMacrosByUserIDAndDate(userId,localDate).orElse(new ArrayList<>());
		}
		else{
			throw new RuntimeException("No user found!");
		}


	}
}
