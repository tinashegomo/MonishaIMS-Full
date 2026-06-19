package com.tinasheGomo.MonishaInventoryManagementSystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    // This class extracts and validates JWT tokens
    private final JWTUtils jwtUtils;

    // This class loads user details from database
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.startsWith("/api/monishaInventory/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

         /*
         STEP 1
         Get Authorization header from HTTP request
         Example header from frontend:

         Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         */

        final String authHeader = request.getHeader("Authorization");

        String jwtToken = null;
        String username = null;

        /*
         STEP 2
         Check if header exists and starts with "Bearer "
         */
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            // Remove "Bearer " part
            jwtToken = authHeader.substring(7);

            /*
             STEP 3
             Extract username (email) from token
             using JWTUtils
             */

            username = jwtUtils.getUsernameFromToken(jwtToken);
        }

        /*
         STEP 4
         Check if username exists AND user is not already authenticated
         */
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            /*
             STEP 5
             Load user from database
             using CustomUserDetailsService
             */

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            /*
             STEP 6
             Validate the token
             */

            if (jwtUtils.isTokenValid(jwtToken, userDetails)) {

                /*
                 STEP 7
                 Create authentication object
                 */

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,         // authenticated user
                                null,                // password not needed
                                userDetails.getAuthorities() // roles
                        );

                /*
                 STEP 8
                 Attach request details (IP address, session etc)
                 */

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );


                /*
                 STEP 9
                 Store authentication inside SecurityContext
                 */

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);
            }
        }

        /*
         STEP 10
         Continue request to next filter or controller
         */

        filterChain.doFilter(request, response);

    }
}
