package com.expense_tracker.controller;

import com.expense_tracker.dto.QueryRequest;
import com.expense_tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/ai")
public class AiController {

    private final ExpenseService expenseService;

    public AiController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/query")
    public String askQuestion(@RequestBody QueryRequest request) {
        return expenseService.answerQuery(request.getQuestion());
    }
}