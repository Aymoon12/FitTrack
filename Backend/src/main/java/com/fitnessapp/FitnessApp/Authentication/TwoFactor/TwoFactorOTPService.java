package com.fitnessapp.FitnessApp.Authentication.TwoFactor;

import com.fitnessapp.FitnessApp.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TwoFactorOTPService {

	private final TwoFactorOTPRepository otpRepository;

	public TwoFactorOTP createTwoFactorOTP(User user, String otp) {
		UUID uuid = UUID.randomUUID();

		String id = uuid.toString();

		TwoFactorOTP twoFactorOTP = new TwoFactorOTP();
		twoFactorOTP.setOtp(otp);
		twoFactorOTP.setId(id);
		twoFactorOTP.setUser(user);
		return otpRepository.save(twoFactorOTP);

	}

	public TwoFactorOTP findByUserID(Long userID) {
		return otpRepository.findByUserID(userID);
	}

	public TwoFactorOTP findByID(String id) {
		Optional<TwoFactorOTP> otp = otpRepository.findById(id);
		return otp.orElse(null);
	}

	public boolean verifyTwoFactorOTP(TwoFactorOTP twoFactorOTP, String otp) {
		return twoFactorOTP.getOtp().equals(otp);
	}

	public void deleteTwoFactorOTP(TwoFactorOTP twoFactorOTP) {
		otpRepository.delete(twoFactorOTP);
	}

}
