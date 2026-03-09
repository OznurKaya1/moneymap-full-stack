package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.service.UserService;
import com.launchcode.moneymapbackend.dto.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    @Autowired
    private UserService userService;

    /**
     * Step 1: User submits their email.
     * System checks if the email exists in the database.
     */
    @PostMapping("/forgot-password/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        boolean exists = userService.emailExists(email);

        if (!exists) {
            return ResponseEntity.status(404).body("No account found with that email address.");
        }

        return ResponseEntity.ok("Email verified. You may now reset your password.");
    }

    /**
     * Step 2: User submits their email + new password.
     * System hashes the new password and updates it in the database.
     */
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body("New password is required.");
        }

        if (request.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters.");
        }

        boolean updated = userService.resetPassword(request.getEmail(), request.getNewPassword());

        if (!updated) {
            return ResponseEntity.status(404).body("No account found with that email address.");
        }

        return ResponseEntity.ok("Password has been successfully updated.");
    }
}