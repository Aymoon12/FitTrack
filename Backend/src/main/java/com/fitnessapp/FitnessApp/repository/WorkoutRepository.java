package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

	@Query("SELECT w FROM Workout w WHERE w.date_added=?1 AND w.user_id=?2")
	Optional<List<Workout>> findByDateAndUserId(LocalDate date, Long userId);

	@Query("SELECT COUNT(w) FROM Workout w WHERE w.date_added=?1 AND w.user_id=?2")
	Optional<Long> findTotalByDateAndUserId(LocalDate date, Long userId);

}
