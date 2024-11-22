package com.fitnessapp.FitnessApp.Authentication.TwoFactor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository

public interface TwoFactorOTPRepository extends JpaRepository<TwoFactorOTP, String> {

	@Query("SELECT t FROM TwoFactorOTP t WHERE t.user.ID=?1")
	TwoFactorOTP findByUserID(Long id);

	@Query("SELECT t FROM TwoFactorOTP t WHERE t.id=?1")
	TwoFactorOTP findByUUID(String id);



}
