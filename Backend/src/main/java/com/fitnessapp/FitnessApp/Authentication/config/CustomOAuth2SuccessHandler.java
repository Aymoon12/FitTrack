package com.fitnessapp.FitnessApp.Authentication.config;

import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private final JwtService jwtService;
	private final UserRepository userRepository;
	private final UserService userService;

	public CustomOAuth2SuccessHandler(JwtService jwtService, UserRepository userRepository, UserService userService) {
		this.jwtService = jwtService;
		this.userRepository = userRepository;
		this.userService = userService;
    }

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
		OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
		var user = (OAuth2User) oauthToken.getPrincipal();

		String registrationId = oauthToken.getAuthorizedClientRegistrationId();
		User existingUser = null;

		if ("github".equalsIgnoreCase(registrationId)) {
			existingUser = userRepository.findUserByGitHubID(user.getName()).orElse(null);
		} else if ("google".equalsIgnoreCase(registrationId)) {
			existingUser = userRepository.findUserByGoogleID(user.getName()).orElse(null);
		}

		if (existingUser == null) {
			redirectToSignUp(response, registrationId, user.getName());
		} else {
			redirectToDashboard(response, existingUser);
		}
	}

	private void redirectToSignUp(HttpServletResponse response, String registrationId, String userId) throws IOException {
		String redirectURL = UriComponentsBuilder.fromUriString("http://localhost:3000/signUp")
				.queryParam(registrationId + "ID", userId)
				.build()
				.toUriString();
		response.sendRedirect(redirectURL);
	}

	private void redirectToDashboard(HttpServletResponse response, User user) throws IOException {
		String jwtToken = jwtService.generateToken(user);
		Long streak = userService.updateAndGetStreak(user);
		String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/dashboard")
				.queryParam("userId", user.getID())
				.queryParam("token", jwtToken)
				.build()
				.toUriString();
		response.sendRedirect(redirectUrl);
	}

}

