package com.expense_tracker.controller;

import com.expense_tracker.model.Budget;
import com.expense_tracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping("/set")
    public Budget setBudget(@RequestBody Map<String, Object> body) {
        double limit = Double.parseDouble(body.get("limit").toString());
        String month = body.get("month").toString();
        return budgetService.setBudget(limit, month);
    }

    @GetMapping("/status/{month}")
    public BudgetService.BudgetStatus getStatus(@PathVariable String month) {
        return budgetService.getBudgetStatus(month);
    }
}