package com.fitnessapp.FitnessApp.service;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorAuth;
import com.fitnessapp.FitnessApp.config.TestConfig;
import com.fitnessapp.FitnessApp.dto.UserDTO;
import com.fitnessapp.FitnessApp.model.Response;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@Import({TestConfig.class})
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserService userService;

	@Mock
	private PasswordEncoder passwordEncoder;

	@BeforeEach
	public void setUp(){

	}


	@Test
	void getUserByIDWhenExists(){

		User user = new User();

		user.setID(1L);

		given(userRepository.findUserById(1L))
				.willReturn(Optional.of(user));

		var serviceUser = userService.getUserByID("1");

		assertThat(serviceUser).isNotNull();
		verify(userRepository).findUserById(1L);
		assertThat(serviceUser.getID()).isEqualTo(user.getID());

	}

	@Test
	void getUserByIDWhenNotExists(){

		String userId = "1000";

		when(userRepository.findUserById(1000L)).thenReturn(Optional.empty());


		Exception exception = assertThrows(RuntimeException.class, () -> {
			userService.getUserByID(userId);
		});

		assertEquals("User not Found", exception.getMessage());
		verify(userRepository).findUserById(1000L);
	}

	@Test
	public void testEnableTwoFactor_Success() {
		// Arrange
		Long userId = 1L;
		User user = new User();
		TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
		twoFactorAuth.setEnabled(false);
		user.setTwoFactorAuth(twoFactorAuth);

		when(userRepository.findById(userId)).thenReturn(Optional.of(user));

		// Act
		UserDTO result = userService.enableTwoFactor(userId);

		// Assert
		assertNotNull(result);
		assertTrue(result.getTwoFactorAuth().isEnabled());
		verify(userRepository).save(user); // Verify that save was called
	}

	@Test
	public void testEnableTwoFactor_UserNotFound() {
		// Arrange
		Long userId = 1L;

		when(userRepository.findById(userId)).thenReturn(Optional.empty());

		// Act
		UserDTO result = userService.enableTwoFactor(userId);

		// Assert
		assertNull(result); // Expecting null since user is not found
		verify(userRepository, never()).save(any()); // Ensure save was not called
	}

	@Test
	public void testEnableTwoFactor_AlreadyEnabled() {
		// Arrange
		Long userId = 1L;
		User user = new User();
		TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
		twoFactorAuth.setEnabled(true);
		user.setTwoFactorAuth(twoFactorAuth);

		when(userRepository.findById(userId)).thenReturn(Optional.of(user));

		// Act & Assert
		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
			userService.enableTwoFactor(userId);
		});

		assertEquals("Two Factor is already enabled", exception.getMessage());
		verify(userRepository, never()).save(any()); // Ensure save was not called
	}

	@Test
	public void testDisableTwoFactor_Success() {
		// Arrange
		Long userId = 1L;
		User user = new User();
		TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
		twoFactorAuth.setEnabled(true);
		user.setTwoFactorAuth(twoFactorAuth);

		when(userRepository.findUserById(userId)).thenReturn(Optional.of(user));

		// Act
		Response result = userService.disableTwoFactor(userId);

		// Assert
		assertNotNull(result);
		assertEquals("Two Factor Disabled", result.getMessage());
		assertEquals("200", result.getStatus());
		assertFalse(user.getTwoFactorAuth().isEnabled());
		verify(userRepository).save(user); // Verify that save was called
	}

	@Test
	public void testDisableTwoFactor_UserNotFound() {
		// Arrange
		Long userId = 1L;

		when(userRepository.findUserById(userId)).thenReturn(Optional.empty());

		// Act
		Response result = userService.disableTwoFactor(userId);

		// Assert
		assertNull(result); // Expecting null since user is not found
		verify(userRepository, never()).save(any()); // Ensure save was not called
	}

	@Test
	public void testDisableTwoFactor_AlreadyDisabled() {
		// Arrange
		Long userId = 1L;
		User user = new User();
		TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
		twoFactorAuth.setEnabled(false);
		user.setTwoFactorAuth(twoFactorAuth);

		when(userRepository.findUserById(userId)).thenReturn(Optional.of(user));

		// Act & Assert
		Exception exception = assertThrows(RuntimeException.class, () -> {
			userService.disableTwoFactor(userId);
		});

		assertEquals("Two Factor is already not enabled", exception.getMessage());
		verify(userRepository, never()).save(any()); // Ensure save was not called
	}

	@Test
	public void testChangePassword_Success(){

		// Arrange
		Long userId = 1L;
		String currentPassword = "currentPassword";
		String newPassword = "newPassword";
		User user = new User();
		user.setPassword(passwordEncoder.encode(currentPassword));

		when(userRepository.findUserById(userId)).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);

		// Act
		Response response = userService.changePassword(userId, currentPassword, newPassword);

		// Assert
		assertEquals("Password updated", response.getMessage());
		verify(userRepository).save(user);

		assertTrue(passwordEncoder.matches(newPassword, user.getPassword())); // Verify password is updated

	}








}
