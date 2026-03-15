package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
    // This controller handles user authentication.

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?>signup(@RequestBody UserInfo userinfo){
        if(userInfoRepository.findByEmail(userinfo.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        userinfo.setPassword(passwordEncoder.encode(userinfo.getPassword()));
        userInfoRepository.save(userinfo);
        return ResponseEntity.ok("You are successfully registered");
    }
    //LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserInfo loginRequest){

        // Check if user exists
        UserInfo userInfo = userInfoRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if(userInfo == null){
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found. Please sign up.");
        }

        // Check password
        if(!passwordEncoder.matches(loginRequest.getPassword(), userInfo.getPassword())){
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(userInfo);
    }
}
