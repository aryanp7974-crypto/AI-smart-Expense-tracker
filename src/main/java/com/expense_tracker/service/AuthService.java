package com.expense_tracker.service;

import com.expense_tracker.model.User;
import com.expense_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already registered!";
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return jwtService.generateToken(email);
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found!";
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid password!";
        }
        return jwtService.generateToken(email);
    }
}