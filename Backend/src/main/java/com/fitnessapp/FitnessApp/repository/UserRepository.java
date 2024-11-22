package com.fitnessapp.FitnessApp.repository;

import com.fitnessapp.FitnessApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

	@Query("SELECT u FROM User u WHERE u.ID = ?1")
	Optional<User> findUserById(Long id);

	@Query("SELECT u FROM User u WHERE u.username =?1")
	Optional<User> findUserByUsername(String username);

	@Query("SELECT u FROM User u WHERE u.phone = ?1")
	Optional<User> findUserByPhone(String phone);

	@Query("SELECT u FROM User u WHERE u.email =?1")
	Optional<User> findUserByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.gitHubID=?1")
	Optional<User> findUserByGitHubID(String id);

	@Query("SELECT u FROM User u WHERE u.googleID=?1")
	Optional<User> findUserByGoogleID(String id);




}
