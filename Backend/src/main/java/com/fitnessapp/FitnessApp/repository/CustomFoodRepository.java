package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.model.CustomFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CustomFoodRepository extends JpaRepository<CustomFood, Long> {

	@Query("SELECT f FROM CustomFood f WHERE f.Id =?1")
	Optional<CustomFood> finById(Long id);

	@Query("SELECT f FROM CustomFood f WHERE f.name =?1")
	Optional<CustomFood> findByName(String name);


	@Query("SELECT f FROM CustomFood f WHERE f.name = ?1 AND f.user_id = ?2")
	Optional<CustomFood> findByUserAndName(String userName, Long id);

	@Query("SELECT f FROM CustomFood f WHERE " +
			"(f.name LIKE ?1% OR f.name LIKE %?1 OR f.name LIKE %?1%) " +
			"AND f.user_id = ?2 " +
			"ORDER BY f.name")
	Optional <List<CustomFood>> findAllByNameAndUserID(String food_name, Long id);


}
