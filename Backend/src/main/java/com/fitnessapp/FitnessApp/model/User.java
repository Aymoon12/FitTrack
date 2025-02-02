package com.fitnessapp.FitnessApp.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fitnessapp.FitnessApp.Authentication.TwoFactor.TwoFactorAuth;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;


@Data
@Table
@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class User implements UserDetails {


	@Id
	@Column(unique = true,
			nullable = false)
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long ID;

	@NotBlank(message = "Username is required")
	private String username;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;

	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Email is required")
	private String email;

	@NotBlank(message = "Phone Number is required")
	private String phone;

	@Enumerated(EnumType.STRING)
	private Role role;

	@Past(message = "Date of birth must be in the past")
	private LocalDate dob;

	@Embedded
	private TwoFactorAuth twoFactorAuth;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	private List<Food> allFoods;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	private List<Workout> allWorkouts;

	@OneToOne(cascade = CascadeType.ALL)
	private UserGoals userGoals;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name= "user_id")
	private List<CardiovascularActivity> cardiovascularActivity;

	@PastOrPresent
	private LocalDate lastSignIn;

	private Long streak;

	private boolean completedSurvey;

	private Long age;
	private Double weight;

	@Enumerated(EnumType.STRING)
	private ActivityLevel activityLevel;

	@Enumerated
	private HealthGoal healthGoal;

	private Long longestStreak;
	private Long mostSteps;



	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role.name()));
	}

	@Override
	public boolean isAccountNonExpired() {
		return UserDetails.super.isAccountNonExpired();
	}

	@Override
	public boolean isAccountNonLocked() {
		return UserDetails.super.isAccountNonLocked();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return UserDetails.super.isCredentialsNonExpired();
	}

	@Override
	public boolean isEnabled() {
		return UserDetails.super.isEnabled();
	}


	private String gitHubID;
	private String googleID;


}
