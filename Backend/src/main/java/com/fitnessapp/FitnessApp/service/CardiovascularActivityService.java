package com.fitnessapp.FitnessApp.service;


import com.fitnessapp.FitnessApp.dto.DailyStepsDTO;
import com.fitnessapp.FitnessApp.model.CardiovascularActivity;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.repository.CardiovascularActivityRepository;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.joda.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.fitnessapp.FitnessApp.requests.CardiovascularActivityRequest;

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


    public ResponseEntity<?> logDailyStep(CardiovascularActivityRequest cvar) {

        User user = userRepository.findUserById(cvar.getUser_id()).orElse(null);
        if(user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist");

        CardiovascularActivity c = cardiovascularActivityRepository.findByUserIdAndDate(cvar.getUser_id(),LocalDate.now())
                .orElse(null);

        if(c == null) {
            int weekNum = LocalDateTime.now().getDayOfWeek();
            CardiovascularActivity ca = CardiovascularActivity
                    .builder()
                    .user_id(cvar.getUser_id())
                    .dailySteps(cvar.getDailySteps())
                    .date_added(LocalDate.now())
                    .dayOfWeek(DayOfWeek.of(weekNum))
                    .build();
            cardiovascularActivityRepository.save(ca);
        }
        else {
            c.setDailySteps(cvar.getDailySteps());
            cardiovascularActivityRepository.save(c);
        }

        if(user.getMostSteps() == null || user.getMostSteps() < cvar.getDailySteps()) {
            user.setMostSteps(cvar.getDailySteps());
            userRepository.save(user);
        }
        return ResponseEntity.status(HttpStatus.OK).body("Steps Updated!");
    }

    public Map<DayOfWeek, Long> getWeeklyStepsByUserId(Long userId) {

        var todayNumWeekDay = LocalDateTime.now().getDayOfWeek();
        System.out.println(todayNumWeekDay);
        LocalDate monday = null;

        if(todayNumWeekDay != 1) {
            monday = LocalDate.now().minusDays(todayNumWeekDay -1);
            System.out.println(monday);
        }
        else
            monday = LocalDate.now();

        List<DailyStepsDTO> dailyStepsList = cardiovascularActivityRepository
                .getWeeklyStepsByUserID(userId, monday, LocalDate.now())
                .orElse(null);

        assert dailyStepsList != null;

        return dailyStepsList.stream()
                .collect(Collectors.toMap(
                        DailyStepsDTO::getDayOfWeek,
                        DailyStepsDTO::getDailySteps
                ));

    }
}
