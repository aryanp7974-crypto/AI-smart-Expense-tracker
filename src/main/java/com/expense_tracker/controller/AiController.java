package com.expense_tracker.controller;

import com.expense_tracker.dto.QueryRequest;
import com.expense_tracker.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AIService aiService;

    public AiController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/query")
    public ResponseEntity<String> query(@RequestBody QueryRequest request) {
        if (request == null || request.getQuestion() == null) {
            return ResponseEntity.badRequest().body("Invalid request.");
        }
        String answer = aiService.answerQuery(request.getQuestion());
        return ResponseEntity.ok(answer);
    }
}