package com.tinasheGomo.MonishaInventoryManagementSystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JWTUtils {

    // Token validity period (3 months)
    private static final long TOKEN_EXPIRATION = 7776000000L;

    // Secret key used to sign tokens
    private SecretKey key;

    // Read secret from application.properties
    @Value("${SecretJwtString}")
    private String secretJwtString;

    // Runs automatically when Spring creates this class
    @PostConstruct
    public void init(){

        // Convert secret string into bytes
        byte[] keyBytes = secretJwtString.getBytes(StandardCharsets.UTF_8);

        // Create the cryptographic signing key
        key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    // Create JWT token after login
    public String generateToken(String email){

        Date now = new Date(); // current time
        Date expiry = new Date(now.getTime() + TOKEN_EXPIRATION);

        return Jwts.builder()

                // store email inside token
                .subject(email)

                // token creation time
                .issuedAt(now)

                // expiration time
                .expiration(expiry)

                // sign token using secret key
                .signWith(key)

                // convert token to string
                .compact();
    }

    // Generic method to extract any claim
    private <T> T getClaim(String token, Function<Claims,T> resolver){

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return resolver.apply(claims);
    }

    // Extract username stored inside token
    public String getUsernameFromToken(String token){
        return getClaim(token, Claims::getSubject);
    }

    // Extract expiration date from token
    public Date getExpiration(String token){
        return getClaim(token, Claims::getExpiration);
    }

    // Check if token expired
    private boolean isTokenExpired(String token){
        return getExpiration(token).before(new Date());
    }

    // Validate token
    public boolean isTokenValid(String token, UserDetails userDetails){

        String username = getUsernameFromToken(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }
}
