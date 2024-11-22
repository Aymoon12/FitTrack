package com.fitnessapp.FitnessApp.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Workout {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;


	private Long user_id;

	@NotBlank(message = "Please enter a workout name")
	private String workout_name;


	private Long sets;


	private Long reps;


	private Double weight_lbs;

	@PastOrPresent(message = "Cannot log a date in the future")
	private LocalDate date_added;

}
