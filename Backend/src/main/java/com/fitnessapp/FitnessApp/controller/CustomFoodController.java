package com.fitnessapp.FitnessApp.controller;

import com.fitnessapp.FitnessApp.model.CustomFood;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.requests.CustomFoodRequest;
import com.fitnessapp.FitnessApp.service.CustomFoodService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customFood")
@AllArgsConstructor
@CrossOrigin
public class CustomFoodController {

	private final CustomFoodService customFoodService;

	@PostMapping("/createFood")
	public ResponseEntity<CustomFood> createFood(@RequestBody CustomFoodRequest customFood){
		return ResponseEntity.ok(customFoodService.addFood(customFood));
	}

	@PatchMapping("/editFood")
	public ResponseEntity<Response> editFoodByID(@RequestBody CustomFoodRequest customFood,
												 @RequestParam Long Id){
		return ResponseEntity.ok(customFoodService.editFoodByID(customFood,Id));
	}

	@GetMapping("/getFood")
	public ResponseEntity<List<CustomFood>> findFoodByNameAndUserId(@RequestParam Long user_id,
																	@RequestParam String food_name){
		return ResponseEntity.ok(customFoodService.findFoodByNameAndUserId (user_id,food_name));
	}
}
