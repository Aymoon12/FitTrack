package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.model.UserGoals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserGoalsRepository extends JpaRepository<UserGoals, Long> {

	@Query("SELECT ug FROM UserGoals ug WHERE ug.user_id=?1")
	Optional<UserGoals> findByUserId(Long userId);


}
