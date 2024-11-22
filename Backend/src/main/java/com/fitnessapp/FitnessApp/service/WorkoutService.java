package com.fitnessapp.FitnessApp.service;

import com.fitnessapp.FitnessApp.dto.WorkoutDTO;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.model.Workout;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.repository.WorkoutRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class WorkoutService {

	private final WorkoutRepository workoutRepository;
	private final UserRepository userRepository;

	public Workout addWorkout(WorkoutDTO workout) {

		LocalDate date  = LocalDate.parse(workout.getDate_added());
		 Workout newWorkout = Workout.builder()
				.workout_name(workout.getWorkout_name())
				.reps(workout.getReps())
				.sets(workout.getSets())
				.user_id(workout.getUser_id())
				.weight_lbs(workout.getWeight_lbs())
				.date_added(date)
				.build();

		 return workoutRepository.save(newWorkout);


	}

	public List<Workout> getAllWorkoutsByUserId(Long userId) {

		User user = userRepository.findUserById(userId).orElseThrow(
				() -> new UsernameNotFoundException("User not found"));

		return user.getAllWorkouts();

	}

	public List<Workout> getAllWorkoutsByDateByUser(Long userId, String date) {
		LocalDate date1 = LocalDate.parse(date);
		return workoutRepository.findByDateAndUserId(date1,userId).orElseThrow(
				() -> new RuntimeException("Workouts not found")
		);
	}

	public String deleteWorkoutById(Long workoutId) {

		Workout workout = workoutRepository.findById(workoutId).orElseThrow(
				() -> new RuntimeException("Workout not found")
		);
		workoutRepository.delete(workout);
		workoutRepository.flush();
		return "Workout deleted successfully";
	}
}
