package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.dto.DailyStepsDTO;
import com.fitnessapp.FitnessApp.model.CardiovascularActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface CardiovascularActivityRepository extends JpaRepository<CardiovascularActivity, Long> {

    @Query("SELECT ca FROM CardiovascularActivity ca WHERE ca.user_id = ?1 AND ca.date_added = ?2")
    Optional<CardiovascularActivity> findByUserIdAndDate(Long user_id, LocalDate date);

    @Query("SELECT new com.fitnessapp.FitnessApp.dto.DailyStepsDTO(ca.dayOfWeek, ca.dailySteps) " +
            "FROM CardiovascularActivity ca " +
            "WHERE ca.user_id=?1 AND ca.date_added " +
            "BETWEEN ?2 AND ?3")
    Optional<List<DailyStepsDTO>> getWeeklyStepsByUserID(Long user_id, LocalDate start, LocalDate end);
}
