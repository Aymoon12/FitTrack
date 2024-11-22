package com.fitnessapp.FitnessApp.controller;

import com.fitnessapp.FitnessApp.Authentication.config.JwtService;
import com.fitnessapp.FitnessApp.dto.UserDTO;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.model.UserGoals;
import com.fitnessapp.FitnessApp.requests.UpdateInfoRequest;
import com.fitnessapp.FitnessApp.requests.UserGoalsRequest;
import com.fitnessapp.FitnessApp.requests.VerificationTypeRequest;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.service.UserGoalsService;
import com.fitnessapp.FitnessApp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/user")
@AllArgsConstructor
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final UserGoalsService userGoalsService;

	@GetMapping("/getUser")
	public ResponseEntity<UserDTO> getUser(HttpServletRequest request) {
		return ResponseEntity.ok(userService.getUser(request));
	}

	@GetMapping("/getUserByID")
	public ResponseEntity<UserDTO> getUserById(@RequestParam String user_id) {
		return ResponseEntity.ok(userService.getUserByID(user_id));
	}

	@PatchMapping("/enable-two-factor")
	public ResponseEntity<UserDTO> enableTwoFactor(@RequestParam Long user_id) {
		return ResponseEntity.ok(userService.enableTwoFactor(user_id));
	}

	@PatchMapping("/disable-two-factor")
	public ResponseEntity<Response> disableTwoFactor(@RequestParam Long user_id){
		return ResponseEntity.ok(userService.disableTwoFactor(user_id));
	}

	@PostMapping("/updateGoals")
	public ResponseEntity<String> updateGoals(@RequestBody UserGoalsRequest ugr){
		return ResponseEntity.ok(userGoalsService.updateGoals(ugr));
	}

	@GetMapping("/getUserGoals")
	public ResponseEntity<UserGoals> getUserGoals(@RequestParam Long user_id){
		return ResponseEntity.ok(userGoalsService.getUserGoals(user_id));
	}

	@PatchMapping("/changePassword")
	public ResponseEntity<Response> changePassword(@RequestParam Long user_id,
												   @RequestParam String currentPassword,
												   @RequestParam String newPassword){
		return ResponseEntity.ok(userService.changePassword(user_id,currentPassword,newPassword));
	}

	@GetMapping("/getTwoFactorStatus")
	public ResponseEntity<Boolean> isTwoFactorStatus(@RequestParam Long user_id){
		return ResponseEntity.ok(userService.isTwoFactorStatus(user_id));
	}

	@PatchMapping("/updateUserInfo")
	public ResponseEntity<Response> updateUserInfo(@RequestParam Long user_id,
												   @RequestBody UpdateInfoRequest updateInfoRequest){
		return ResponseEntity.ok(userService.updateUserInfo(user_id,updateInfoRequest));
	}




}
