package com.fitnessapp.FitnessApp.controller;


import com.fitnessapp.FitnessApp.requests.CardiovascularActivityRequest;
import com.fitnessapp.FitnessApp.service.CardiovascularActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/cardio")
@AllArgsConstructor
public class CardiovascularActivityController {

    private final CardiovascularActivityService cardiovascularActivityService;

    @PostMapping("/logStep")
    ResponseEntity<?> logDailyStep(@RequestBody CardiovascularActivityRequest cardio){
        return ResponseEntity.ok(cardiovascularActivityService.logDailyStep(cardio));

    }

    @GetMapping("/getWeekSteps")
    ResponseEntity<Map<DayOfWeek, Long>> getWeeklyStepsByUserId(@RequestParam Long user_id){
        return ResponseEntity.ok(cardiovascularActivityService.getWeeklyStepsByUserId(user_id));
    }
}
