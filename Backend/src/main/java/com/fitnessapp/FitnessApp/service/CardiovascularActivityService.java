package com.fitnessapp.FitnessApp.service;


import com.fitnessapp.FitnessApp.dto.DailyStepsDTO;
import com.fitnessapp.FitnessApp.model.CardiovascularActivity;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.CardiovascularActivityRepository;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import com.fitnessapp.FitnessApp.requests.CardiovascularActivityRequest;
import lombok.AllArgsConstructor;
import org.joda.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CardiovascularActivityService {

    private final UserRepository userRepository;
    private final CardiovascularActivityRepository cardiovascularActivityRepository;
    public ResponseEntity<?> logDailyStep(CardiovascularActivityRequest cardio) {

        User user = userRepository.findUserById(cardio.getUser_id()).orElse(null);
        if(user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist");

        CardiovascularActivity c = cardiovascularActivityRepository.findByUserIdAndDate(cardio.getUser_id(),LocalDate.now())
                .orElse(null);

        if(c == null) {
            int weekNum = LocalDateTime.now().getDayOfWeek();
            CardiovascularActivity ca = CardiovascularActivity
                    .builder()
                    .user_id(cardio.getUser_id())
                    .dailySteps(cardio.getDailySteps())
                    .date_added(LocalDate.now())
                    .dayOfWeek(DayOfWeek.of(weekNum))
                    .build();
            cardiovascularActivityRepository.save(ca);
        }
        else {
            c.setDailySteps(cardio.getDailySteps());
            cardiovascularActivityRepository.save(c);
        }
        return ResponseEntity.status(HttpStatus.OK).body("Steps Updated!");
    }

    public Map<DayOfWeek, Long> getWeeklyStepsByUserId(Long userId) {

        var todayNumWeekDay = LocalDateTime.now().getDayOfWeek();
        LocalDate sunday = null;
        if(todayNumWeekDay != 1)
           sunday = LocalDate.now().minusDays(todayNumWeekDay);
        else
            sunday = LocalDate.now();

        List<DailyStepsDTO> dailyStepsList = cardiovascularActivityRepository
                .getWeeklyStepsByUserID(userId, sunday, LocalDate.now())
                .orElse(null);

        assert dailyStepsList != null;

        return dailyStepsList.stream()
                .collect(Collectors.toMap(
                        DailyStepsDTO::getDayOfWeek,
                        DailyStepsDTO::getDailySteps
                ));

    }
}
