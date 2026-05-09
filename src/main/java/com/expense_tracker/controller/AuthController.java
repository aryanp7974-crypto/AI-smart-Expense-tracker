package com.expense_tracker.controller;

import com.expense_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> body) {
        return authService.register(
                body.get("name"),
                body.get("email"),
                body.get("password")
        );
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {
        return authService.login(
                body.get("email"),
                body.get("password")
        );
    }
}