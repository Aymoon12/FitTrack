package com.fitnessapp.FitnessApp.Authentication.TwoFactor.email;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "myapp.email")
@Data
public class EmailConfig {
    private String courierAuthorizationToken;
    private String courierTwoFactorTemplate;
    private String courierEmailTemplate;
}