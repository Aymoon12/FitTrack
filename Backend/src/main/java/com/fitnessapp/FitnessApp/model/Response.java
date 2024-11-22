package com.fitnessapp.FitnessApp.model;

import com.fitnessapp.FitnessApp.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Response {

	private String message;
	private UserDTO userDTO;
	private String status;


}
