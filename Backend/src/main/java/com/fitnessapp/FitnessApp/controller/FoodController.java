package com.fitnessapp.FitnessApp.controller;


import com.fitnessapp.FitnessApp.model.Food;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.requests.AddFoodRequest;
import com.fitnessapp.FitnessApp.requests.UpdateServingSizeRequest;
import com.fitnessapp.FitnessApp.service.FoodService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/food")
@AllArgsConstructor
public class FoodController {

	private final FoodService foodService;

	@PostMapping("/addFood")
	public ResponseEntity<Food> addFood(@RequestBody AddFoodRequest food){
		return ResponseEntity.ok(foodService.addFood(food));
	}

	@GetMapping("/meals/{mealType}")
	public ResponseEntity<List<Food>> getMeals(
			HttpServletRequest request, @PathVariable String mealType){
		return ResponseEntity.ok(foodService.getMeals(request,mealType));
	}

	@GetMapping("/getAllMeals")
	public ResponseEntity<Map<String,List<Food>>> getAllMeals(@RequestParam Long user_id,
															  @RequestParam String date){
		return ResponseEntity.ok(foodService.getAllMeals(user_id,date));

	}

	@DeleteMapping("/deleteFood")
	public ResponseEntity<Response> deleteFoodByFoodID(@RequestParam Long food_id ){
		return ResponseEntity.ok(foodService.deleteFoodByFoodId(food_id));
	}

	@PatchMapping("/updateServingSize")
	public ResponseEntity<Food> updateFoodServingSize(@RequestBody UpdateServingSizeRequest request){
		return ResponseEntity.ok(foodService.updateFoodServingSize(request));
	}

	@GetMapping("/getCalories")
	public ResponseEntity<Long> getCaloriesByDateAndUserID(@RequestParam Long user_id,
														   @RequestParam String date){
		return ResponseEntity.ok(foodService.getCaloriesByDateAndUserID(user_id,date));
	}


}
