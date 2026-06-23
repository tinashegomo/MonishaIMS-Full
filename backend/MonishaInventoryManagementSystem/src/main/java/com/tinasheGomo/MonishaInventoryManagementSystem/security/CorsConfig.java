package com.tinasheGomo.MonishaInventoryManagementSystem.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    /*
     This bean defines CORS rules for the entire application.

     It tells Spring:
     - Which frontend can access the backend
     - Which HTTP methods are allowed
     - Which headers are allowed
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){

        // Create a new CORS configuration object
        CorsConfiguration config = new CorsConfiguration();


        /*
         Allowed frontend URLs

         This tells the backend:
         "These frontends are allowed to send requests"
         */
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",                      // React Vite (local dev)
                "http://localhost:3000",                      // React CRA (local dev)
                "https://monisha-ims.vercel.app"              // Production frontend (Vercel)
        ));


        /*
         Allowed HTTP methods

         These are the request types the frontend can use
         */
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));


        /*
         Allowed headers

         This allows things like:
         Authorization: Bearer TOKEN
         Content-Type: application/json
         */
        config.setAllowedHeaders(List.of("*"));


        /*
         Allows sending cookies or Authorization headers
         */
        config.setAllowCredentials(true);


        /*
         Register the configuration for ALL endpoints
         */
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
