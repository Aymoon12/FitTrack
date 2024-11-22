package com.fitnessapp.FitnessApp.requests;


import lombok.*;

import java.time.LocalDate;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class SignUpRequest {

	private String firstname;
	private String lastname;
	private String username;
	private String password;
	private String email;
	private String phone;
	private LocalDate dob;
	private String github_id;
	private String google_id;
}
