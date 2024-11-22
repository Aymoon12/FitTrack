package com.fitnessapp.FitnessApp.requests;


import lombok.Data;

@Data
public class UpdateInfoRequest {

	private String name;
	private String email;
	private String phone;

}
