package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.model.Food;
import com.fitnessapp.FitnessApp.model.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food,Long> {

	@Query("SELECT f FROM Food f WHERE f.name=?1")
	Optional<Food> findByName(String name);

	@Query("SELECT f FROM Food f WHERE f.mealType =?1 AND f.user_id=?2")
	Optional<List<Food>> findByMealType(MealType mealType, Long user_id);

	@Query("SELECT f FROM Food f WHERE f.user_id=?1")
	Optional<List<Food>> findByUserID(Long userID);

	@Query("SELECT f FROM Food f WHERE f.date_added=?1")
	Optional<List<Food>> findByDate(LocalDate date);

	@Query("SELECT f FROM Food f WHERE f.user_id= ?1 AND f.date_added=?2")
	Optional<List<Food>> findByUserIdAndDate(Long user_id, LocalDate date);

	@Query("SELECT f FROM Food f WHERE f.Id=?1")
	Optional<Food> findByFoodId(Long food_id);

	@Query("SELECT SUM(f.calories * f.servings) FROM Food f WHERE f.user_id=?1 AND f.date_added=?2")
	Optional<Long> findTotalCaloriesByUserIDAndDate(Long user_id, LocalDate date);


}
