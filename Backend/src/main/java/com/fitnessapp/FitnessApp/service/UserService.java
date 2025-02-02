package com.fitnessapp.FitnessApp.service;

import com.fitnessapp.FitnessApp.Authentication.TwoFactor.VerificationType;
import com.fitnessapp.FitnessApp.Authentication.config.JwtService;
import com.fitnessapp.FitnessApp.dto.UserDTO;
import com.fitnessapp.FitnessApp.model.*;
import com.fitnessapp.FitnessApp.repository.CardiovascularActivityRepository;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.repository.WorkoutRepository;
import com.fitnessapp.FitnessApp.requests.SurveyResults;
import com.fitnessapp.FitnessApp.requests.UpdateInfoRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;
	private final PasswordEncoder passwordEncoder;
	private final WorkoutRepository workoutRepository;
	private final CardiovascularActivityRepository cardiovascularActivityRepository;

	public UserDTO getUser(HttpServletRequest http) {

		String jwtToken = null;
		String authHeader = http.getHeader("Authorization");
		String username = null;

		if(authHeader != null && authHeader.startsWith("Bearer ")){
			jwtToken = authHeader.substring(7);
			username = jwtService.extractUsername(jwtToken);
			if(username != null) {
				UserDetails cus = userDetailsService.loadUserByUsername(username);
				String un = cus.getUsername();
				User user  = userRepository.findUserByUsername(un).orElse(null);
				if(user == null)
					return null;
				return UserDTO.userToUserDTO(user);
			}
		}
		return null;
	}

	public UserDTO enableTwoFactor(Long id) {

		User user = userRepository.findById(id).orElse(null);
		if(user == null){
			return null;
		}

		if(user.getTwoFactorAuth().isEnabled())
			throw new IllegalArgumentException("Two Factor is already enabled");

		user.getTwoFactorAuth().setEnabled(true);

		user.getTwoFactorAuth().setSendTo(VerificationType.EMAIL);

		userRepository.save(user);
		return UserDTO.userToUserDTO(user);

	}

	public Response disableTwoFactor(Long id) {

		User user = userRepository.findUserById(id).orElse(null);
		if(user == null){
			return null;
		}
		if(!user.getTwoFactorAuth().isEnabled()){
			throw new RuntimeException("Two Factor is already not enabled");
		}
		user.getTwoFactorAuth().setEnabled(false);
		userRepository.save(user);

		return Response.builder()
				.message("Two Factor Disabled")
				.status("200")
				.build();
	}

	public User userDtoToUser(UserDTO userDTO) {
		return userRepository.findUserByUsername(userDTO.getUsername()).orElseThrow(
				()-> new UsernameNotFoundException("Username not found"));

	}


	public UserDTO getUserByID(String userId) {
		return UserDTO.userToUserDTO(userRepository.findUserById(Long.valueOf(userId)).orElseThrow(
				() -> new RuntimeException("User not Found")
		));
	}

	@Transactional
	public Response changePassword(Long userId, String currentPassword, String newPassword) {

		User user = userRepository.findUserById(userId).orElseThrow(
				() -> new RuntimeException("User not found")
		);

		boolean checkPasswords = passwordEncoder.matches(currentPassword, user.getPassword());
		if(!checkPasswords){
			return Response.builder()
					.message("Password does not match current password")
					.build();
		}
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
		return Response.builder()
				.message("Password updated")
				.build();

	}

	public Boolean isTwoFactorStatus(Long userId) {

		User user = userRepository.findUserById(userId).orElseThrow(
				() -> new RuntimeException("User not found")
		);

		return user.getTwoFactorAuth().isEnabled();
	}

	@Transactional
	public Response updateUserInfo(Long userId, UpdateInfoRequest updateInfoRequest) {

		User user = userRepository.findUserById(userId).orElseThrow(
				() -> new RuntimeException("User not found"));

		if(updateInfoRequest.getName() != null && !updateInfoRequest.getName().isEmpty()){
			user.setName(updateInfoRequest.getName());
		}
		if(updateInfoRequest.getEmail() != null && !updateInfoRequest.getEmail().isEmpty()){
			user.setEmail(updateInfoRequest.getEmail());
		}
		if(updateInfoRequest.getPhone() != null && !updateInfoRequest.getPhone().isEmpty()){
			user.setPhone(updateInfoRequest.getPhone());
		}

		userRepository.save(user);

		return Response.builder()
				.message("Successfully updated!")
				.userDTO(UserDTO.userToUserDTO(user))
				.build();


	}

	public Long updateAndGetStreak(User user){
		if(user.getLastSignIn() == null){
			user.setLastSignIn(LocalDate.now());
		}

		if(user.getStreak() == null){
			user.setStreak(1L);
		}

		if(user.getLongestStreak() == null){
			user.setLongestStreak(1L);
		}

		if(user.getLastSignIn().getDayOfYear() == LocalDate.now().getDayOfYear()-1){
			if(user.getLongestStreak() < user.getStreak() + 1){
				user.setLongestStreak(user.getStreak() + 1);
			}
			user.setStreak(user.getStreak()+1);

		}
		else if(user.getLastSignIn().getDayOfYear() != LocalDate.now().getDayOfYear()){
			user.setStreak(1L);
		}
		user.setLastSignIn(LocalDate.now());
		userRepository.save(user);
		return user.getStreak();
	}


    public UserDTO processUserSurveyResults(Long userId, SurveyResults surveyResults) {

		User user = userRepository.findUserById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if(user.isCompletedSurvey()){
			throw new RuntimeException("User has already finished survey!");
		}
		user.setAge(surveyResults.getAge());
		user.setActivityLevel(ActivityLevel.fromString(surveyResults.getActivity()));
		user.setWeight(surveyResults.getWeight());
		user.setHealthGoal(HealthGoal.fromString(surveyResults.getGoal()));
		user.setCompletedSurvey(true);
		userRepository.save(user);
		return UserDTO.userToUserDTO(user);



    }

	public AchievementsResponse getMostStepsAndLongestStreak(Long userId) {

		User user = userRepository.findUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		return AchievementsResponse.builder()
				.mostSteps(user.getMostSteps())
				.longestStreak(user.getLongestStreak())
				.build();
	}

	public List<Long> getWorkoutTimeAndHealthMetrics(Long userId) {

		User user = userRepository.findUserById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		Long totalWorkouts = workoutRepository.findTotalByDateAndUserId(LocalDate.now(), userId).orElse(0L);

		Long workoutTime = totalWorkouts * 15;

		List<Long> res = new ArrayList<>();
		res.add(workoutTime);

		Long userStepGoal = user.getUserGoals().getGoalSteps();
		System.out.println(userStepGoal);
		Long todaysSteps = cardiovascularActivityRepository.getTodaysSteps(userId, LocalDate.now()).orElse(0L);
		System.out.println(todaysSteps);

		Long stepMetric = (long) (((double) todaysSteps / (double) userStepGoal) * 100);
		System.out.println("Step metric " + stepMetric);
		res.add(stepMetric);
		return res;


	}
}
