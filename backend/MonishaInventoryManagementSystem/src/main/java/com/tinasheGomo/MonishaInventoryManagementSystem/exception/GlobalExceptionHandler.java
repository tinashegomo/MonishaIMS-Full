package com.tinasheGomo.MonishaInventoryManagementSystem.exception;

import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateException(
            DuplicateException duplicateException,
            HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                duplicateException.getMessage(),
                request.getRequestURI(),
                HttpStatus.CONFLICT.toString()
        );

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(
            NotFoundException notFoundException,
            HttpServletRequest request){

        ErrorResponse error = new ErrorResponse(
                notFoundException.getMessage(),
                request.getRequestURI(),
                HttpStatus.NOT_FOUND.toString()
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
