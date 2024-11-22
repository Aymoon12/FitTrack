package com.fitnessapp.FitnessApp.model;

import jakarta.persistence.*;
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
public class Food {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long Id;

	@Column(name = "user_id")
	private Long user_id;

	@Enumerated(EnumType.STRING)
	@Column(name = "meal_Type", nullable = false)
	private MealType mealType;

	@Column(name="name",nullable = false)
	private String name;

	@Column(name="calories",nullable = false)
	private Double calories;

	@Column(name="fat_total_g",nullable = false)
	private Double fat_total_g;

	@Column(name="serving_size_g",nullable = false)
	private Double serving_size_g;

	@Column(name="protein_g",nullable = false)
	private Double protein_g;

	@Column(name="sodium_mg",nullable = false)
	private Double sodium_mg;

	@Column(name="potassium_mg",nullable = false)
	private Double potassium_mg;

	@Column(name="cholesterol_mg",nullable = false)
	private Double cholesterol_mg;

	@Column(name="carbohydrates_total_g",nullable = false)
	private Double carbohydrates_total_g;

	@Column(name = "fiber_g",nullable = false)
	private Double fiber_g;

	@Column(name = "sugar_g",nullable = false)
	private Double sugar_g;

	@Column(name = "date_added",nullable = false)
	private LocalDate date_added;

	@Column(name = "servings", nullable = false)
	private Double servings;


}
