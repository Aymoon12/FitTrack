package com.fitnessapp.FitnessApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserGoals {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Long user_id;
	private Long goalCalories;
	private Long goalProtein;
	private Long goalCarbohydrates;
	private Long goalFats;
	private Long goalSteps;
}
