package com.fitnessapp.FitnessApp.dto;


import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorAuth;
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
				.build();


	}
}
