package com.fitnessapp.FitnessApp.Authentication.auth;

import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorAuth;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorOTP;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorOTPRepository;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorOTPService;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.email.EmailService;
import com.fitnessapp.FitnessApp.Authentication.config.JwtService;
import com.fitnessapp.FitnessApp.dto.UserDTO;
import com.fitnessapp.FitnessApp.model.Role;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.requests.LoginRequest;
import com.fitnessapp.FitnessApp.requests.OTPRequest;
import com.fitnessapp.FitnessApp.requests.SignUpRequest;
import com.fitnessapp.FitnessApp.service.UserService;
import com.fitnessapp.FitnessApp.utils.OTPUtils;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final TwoFactorOTPService twoFactorOTPService;
	private final EmailService emailService;
	private final TwoFactorOTPRepository twoFactorOTPRepository;
	private final UserService userService;

	public AuthenticationResponse register(SignUpRequest request){

		if(userRepository.findUserByUsername(request.getUsername())
				.orElse(null) != null){
			throw new IllegalArgumentException("Username is already in use");
		}

		if(userRepository.findUserByEmail(request.getEmail())
				.orElse(null) != null){
			throw new IllegalArgumentException("Email is already in use");
		}

		if(userRepository.findUserByPhone(request.getPhone())
				.orElse(null) != null){
			throw new IllegalArgumentException("Phone Number is already in use");
		}

		System.out.println(request);



		User user = new User();
			user.setName(request.getFirstname() + " " + request.getLastname());
			user.setEmail(request.getEmail());
			user.setPhone(request.getPhone());
			user.setDob(request.getDob());
			user.setUsername(request.getUsername());
			user.setPassword(passwordEncoder.encode(request.getPassword()));
			user.setRole(Role.USER);
			user.setTwoFactorAuth(new TwoFactorAuth());
			user.setStreak(1L);
			user.setLastSignIn(LocalDate.now());
			user.setCompletedSurvey(false);
		if (request.getGithub_id() != null){
			user.setGitHubID(request.getGithub_id());
		}
		if (request.getGoogle_id() != null){
			user.setGoogleID(request.getGoogle_id());
		}



		var jwtToken = jwtService.generateToken(user);

		AuthenticationResponse response = new AuthenticationResponse();
		response.setToken(jwtToken);
		response.setTwoFactorEnabled(false);
		userRepository.save(user);
		return response;
	}

	public AuthenticationResponse authenticate(LoginRequest loginRequest) {

		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						loginRequest.getUsername(),
						loginRequest.getPassword()
				)
		);

		var user = userRepository.findUserByUsername(loginRequest.getUsername())
				.orElseThrow(() ->
						new UsernameNotFoundException("Username not found!"));


		if(user.getTwoFactorAuth().isEnabled()){
			AuthenticationResponse response = new AuthenticationResponse();
			response.setTwoFactorEnabled(true);
			String otp = OTPUtils.generateOTP();
			TwoFactorOTP oldtwoFactorOTP = twoFactorOTPService.
					findByUserID(user.getID());
			if(oldtwoFactorOTP != null)
				twoFactorOTPService.deleteTwoFactorOTP(oldtwoFactorOTP);

			TwoFactorOTP newtwoFactorOTP = twoFactorOTPService.
					createTwoFactorOTP(user,otp);
			response.setUuid(newtwoFactorOTP.getId());

			try {
				emailService.sendVerificationOtpEmail(user.getEmail(), otp);
			} catch(Exception e){
				throw new IllegalArgumentException(e.getMessage());
			}
			return response;

		}
		var jwtToken = jwtService.generateToken(user);


		Long streak = userService.updateAndGetStreak(user);
		UserDTO userDTO = UserDTO.userToUserDTO(user);
		userDTO.setStreak(streak);
		AuthenticationResponse response = new AuthenticationResponse();
		response.setToken(jwtToken);
		response.setTwoFactorEnabled(false);
		response.setUserDTO(userDTO);
		return response;

	}


	public AuthenticationResponse verifyOTP(OTPRequest otpRequest) {

		TwoFactorOTP twoFactorOTP = twoFactorOTPRepository.findByUUID(otpRequest.getUuid());

		if(twoFactorOTPService.verifyTwoFactorOTP(twoFactorOTP,otpRequest.getOtp())){
			AuthenticationResponse response = new AuthenticationResponse();
			response.setMessage("Verified");
			response.setTwoFactorEnabled(true);
			response.setToken(jwtService.generateToken(twoFactorOTP.getUser()));
			response.setUserDTO(UserDTO.userToUserDTO(twoFactorOTP.getUser()));
			twoFactorOTPRepository.delete(twoFactorOTP);
			return response;
		}
		throw new IllegalArgumentException("Invalid OTP");
	}

	public Boolean sendPasswordResetLink(String email) {

		try{
			emailService.sendPasswordResetLink(email);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		return true;
	}
}
