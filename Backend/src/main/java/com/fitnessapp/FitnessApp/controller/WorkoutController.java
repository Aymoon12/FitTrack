package com.fitnessapp.FitnessApp.controller;

import com.fitnessapp.FitnessApp.dto.WorkoutDTO;
import com.fitnessapp.FitnessApp.model.Workout;
import com.fitnessapp.FitnessApp.service.WorkoutService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/workout")
@AllArgsConstructor
public class WorkoutController {

	private final WorkoutService workoutService;

	@PostMapping("/addWorkout")
	ResponseEntity<Workout> addWorkout(@RequestBody WorkoutDTO workout){
		return new ResponseEntity<>(workoutService.addWorkout(workout), HttpStatus.ACCEPTED);
	}

	@GetMapping("/getAllWorkouts")
	ResponseEntity<List<Workout>> getAllWorkoutsByUserId(@RequestParam Long user_id){
		return ResponseEntity.ok(workoutService.getAllWorkoutsByUserId(user_id));
	}

	@GetMapping("/getAllWorkoutsByDate")
	ResponseEntity<List<Workout>> getAllWorkoutsByDateAndUser(@RequestParam Long user_id,
															  @RequestParam String date){
		return ResponseEntity.ok(workoutService.getAllWorkoutsByDateByUser(user_id,date));
	}

	@DeleteMapping("/deleteWorkout")
	ResponseEntity<String> deleteWorkoutById(@RequestParam Long workout_id){
		return ResponseEntity.ok(workoutService.deleteWorkoutById(workout_id));
	}
}
