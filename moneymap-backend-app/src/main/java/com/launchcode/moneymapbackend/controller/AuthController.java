package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        UserInfo userInfo = userInfoRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), userInfo.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        return ResponseEntity.ok("Login successful");
    }
}
