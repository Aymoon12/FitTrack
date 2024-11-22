package com.fitnessapp.FitnessApp.Authentication.auth;

import com.fitnessapp.FitnessApp.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

	private String token;
	private boolean isTwoFactorEnabled;
	private String message;
	private String uuid;
	private UserDTO userDTO;



}
