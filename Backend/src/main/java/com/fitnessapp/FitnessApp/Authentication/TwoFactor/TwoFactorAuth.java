package com.fitnessapp.FitnessApp.Authentication.TwoFactor;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class TwoFactorAuth {

	private boolean isEnabled= false;

	@Enumerated(EnumType.STRING)
	private VerificationType sendTo;


}
