package com.fitnessapp.FitnessApp.requests;

import lombok.Data;

@Data
public class UpdateServingSizeRequest {

	private Long food_id;
	private Double servingSize;
}
