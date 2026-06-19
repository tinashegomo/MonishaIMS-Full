package com.tinasheGomo.MonishaInventoryManagementSystem.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Service that loads user from database
    private final CustomUserDetailsService userDetailsService;

    // Our JWT filter
    private final AuthFilter AuthFilter;

    /*
     Password Encoder

     This is used to hash passwords before saving them to database.

     Example:
     password = "123456"

     Stored in DB:
     $2a$10$QJm....
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     Authentication Provider

     This tells Spring Security HOW to authenticate a user.

     It uses:
     - userDetailsService (to load user from DB)
     - passwordEncoder (to compare passwords)
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        // Tell Spring where to load users from
        provider.setUserDetailsService(userDetailsService);

        // Tell Spring how passwords are encrypted
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    /*
     Authentication Manager

     This is used during login to authenticate credentials.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    /*
     Main Security Configuration

     This controls which endpoints are protected.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {}) // enable CORS using CorsConfig

                /*
                 Disable CSRF because we are using JWT
                 (stateless API)
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 JWT APIs are stateless

                 Server does NOT store sessions
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                /*
                 Configure endpoint authorization
                 */
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers("/api/monishaInventory/auth/**").permitAll()

                        // Everything else requires login
                        .anyRequest().authenticated()
                )

                /*
                 Use our authentication provider
                 */
                .authenticationProvider(authenticationProvider())


                /*
                 Add JWT filter BEFORE Spring's login filter
                 */
                .addFilterBefore(AuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}