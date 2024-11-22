package com.fitnessapp.FitnessApp.Authentication.TwoFactor;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fitnessapp.FitnessApp.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class TwoFactorOTP {

	@Id
	private String id;
	private String otp;

	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	@OneToOne
	private User user;



}
