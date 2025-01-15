package com.fitnessapp.FitnessApp.Authentication.TwoFactor.email;

import com.courier.api.Courier;
import com.courier.api.requests.SendMessageRequest;
import com.courier.api.resources.send.types.*;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashMap;


@Service
@AllArgsConstructor
@Log4j2
public class EmailService {


	private final EmailConfig emailConfig;

	public void sendVerificationOtpEmail(String email, String otp) throws MessagingException {

		HashMap<String,Object> data = new HashMap<>();
		data.put("one_time_password",otp);


		Courier courier = Courier.builder()
				.authorizationToken(emailConfig.getCourierAuthorizationToken())
				.build();

		courier.send(SendMessageRequest.builder()
				.message(Message.of(TemplateMessage.builder()
						.template(emailConfig.getCourierTwoFactorTemplate())
						.to(MessageRecipient.of(Recipient.of(UserRecipient.builder()
								.email(email)
								.build())))
								.data(data)
						.build()))
				.build());

		log.info("Email sent to {}", email);
	}



	@SuppressWarnings("LoggingSimilarMessage")
	public void sendPasswordResetLink(String email) throws MessagingException {


		Courier courier = Courier.builder()
				.authorizationToken(emailConfig.getCourierAuthorizationToken())
				.build();

		courier.send(SendMessageRequest.builder()
				.message(Message.of(TemplateMessage.builder()
						.template(emailConfig.getCourierEmailTemplate())
						.to(MessageRecipient.of(Recipient.of(UserRecipient.builder()
								.email(email)
								.build())))
						.build()))
				.build());

		log.info("Email sent to {}", email);
	}

}
