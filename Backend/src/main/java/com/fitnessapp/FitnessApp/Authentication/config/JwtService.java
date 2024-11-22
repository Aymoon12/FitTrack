package com.fitnessapp.FitnessApp.Authentication.config;


import com.fitnessapp.FitnessApp.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

	private static final String SECRET_KEY = "1100b4ac808defcc414d37d3a04737f9e23f7161671732ea9e776c3f119c44be";

	public String extractUsername(String token) {
		return extractClaim(token,Claims::getSubject);
	}

	public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){

		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts
				.parser()
				.verifyWith(getSignInKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public String generateToken(User customer){

		String token = Jwts
				.builder()
				.subject(customer.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
				.signWith(getSignInKey())
				.compact();
		return token;
	}

	public String generateToken(OAuth2User oauth2User) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("sub", oauth2User.getName());
		claims.put("name", oauth2User.getAttribute("name"));
		claims.put("email", oauth2User.getAttribute("email"));
		claims.put("username", oauth2User.getAttribute("login"));


		return Jwts
				.builder()
				.subject(oauth2User.getName())
				.setClaims(claims)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
				.signWith(getSignInKey())
				.compact();


	}



	public boolean isTokenValid(String token, UserDetails userDetails){

		final String username = extractUsername(token);
		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token){
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token){
		return extractClaim(token,Claims::getExpiration);
	}



	private SecretKey getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

}
