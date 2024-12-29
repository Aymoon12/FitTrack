package com.fitnessapp.FitnessApp.dto;


import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorAuth;
import com.fitnessapp.FitnessApp.model.ActivityLevel;
import com.fitnessapp.FitnessApp.model.HealthGoal;
import com.fitnessapp.FitnessApp.model.Role;
import com.fitnessapp.FitnessApp.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UserDTO {

	private Long ID;
	private String username;
	private String name;
	private String email;
	private String phone;
	private Role role;
	private LocalDate dob;
	private TwoFactorAuth twoFactorAuth;
	private Long streak;
	private boolean completedSurvey;
	private Long age;
	private Double weight;
	private ActivityLevel activityLevel;
	private HealthGoal healthGoal;
	private Long longestStreak;
	private Long mostSteps;


	public static UserDTO userToUserDTO(User user) {

		return UserDTO.builder()
				.ID(user.getID())
				.username(user.getUsername())
				.name(user.getName())
				.email(user.getEmail())
				.phone(user.getPhone())
				.role(user.getRole())
				.dob(user.getDob())
				.twoFactorAuth(user.getTwoFactorAuth())
				.streak(user.getStreak())
				.completedSurvey(user.isCompletedSurvey())
				.age(user.getAge())
				.weight(user.getWeight())
				.activityLevel(user.getActivityLevel())
				.healthGoal(user.getHealthGoal())
				.longestStreak(user.getLongestStreak())
				.mostSteps(user.getMostSteps())
				.build();


	}
}
