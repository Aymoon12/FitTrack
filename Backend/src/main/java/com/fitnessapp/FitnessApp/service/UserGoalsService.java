package com.fitnessapp.FitnessApp.service;

import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.model.UserGoals;
import com.fitnessapp.FitnessApp.repository.UserGoalsRepository;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.requests.UserGoalsRequest;
import lombok.Data;
import org.springframework.stereotype.Service;

@Service
@Data
public class UserGoalsService {

	private final UserGoalsRepository userGoalsRepository;
	private final UserRepository userRepository;

	public String updateGoals(UserGoalsRequest ugr) {


		UserGoals userGoals = userGoalsRepository.findByUserId(ugr.getUser_id()).orElse(null);

		if(userGoals != null) {
			if (ugr.getGoalCalories() != null) {
				userGoals.setGoalCalories(ugr.getGoalCalories());
			}
			if (ugr.getGoalFats() != null) {
				userGoals.setGoalFats(ugr.getGoalFats());
			}
			if (ugr.getGoalCarbohydrates() != null) {
				userGoals.setGoalCarbohydrates(ugr.getGoalCarbohydrates());
			}
			if (ugr.getGoalProtein() != null) {
				userGoals.setGoalProtein(ugr.getGoalProtein());
			}
			if (ugr.getGoalSteps() != null) {
				userGoals.setGoalSteps(ugr.getGoalSteps());
			}
			userGoalsRepository.save(userGoals);
		}
		else{
			User user = userRepository.findUserById(ugr.getUser_id()).orElseThrow(
					() -> new RuntimeException("User not found")
			);

			UserGoals newUserGoals = new UserGoals();
			user.setUserGoals(newUserGoals);

			newUserGoals.setUser_id(ugr.getUser_id());

			if (ugr.getGoalCalories() != null) {
				newUserGoals.setGoalCalories(ugr.getGoalCalories());
			}
			if (ugr.getGoalFats() != null) {
				newUserGoals.setGoalFats(ugr.getGoalFats());
			}
			if (ugr.getGoalCarbohydrates() != null) {
				newUserGoals.setGoalCarbohydrates(ugr.getGoalCarbohydrates());
			}
			if (ugr.getGoalProtein() != null) {
				newUserGoals.setGoalProtein(ugr.getGoalProtein());
			}
			if (ugr.getGoalSteps() != null) {
				newUserGoals.setGoalSteps(ugr.getGoalSteps());
			}
			userGoalsRepository.save(newUserGoals);

		}

		return "Sucessfully Updated";
	}

	public UserGoals getUserGoals(Long userId) {

		User user = userRepository.findUserById(userId).orElseThrow(
				()-> new RuntimeException("User not found")
		);
		return user.getUserGoals();
	}
}
