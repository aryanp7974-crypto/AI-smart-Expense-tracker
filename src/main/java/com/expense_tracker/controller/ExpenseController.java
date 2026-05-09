package com.expense_tracker.controller;

import com.expense_tracker.dto.QueryRequest;
import com.expense_tracker.model.Expense;
import com.expense_tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    // Constructor Injection
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // ✅ Add Expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    // ✅ Get All Expenses
    @GetMapping
    public List<Expense> getExpenses() {
        return expenseService.getAllExpenses();
    }

    // ✅ Delete Expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    // ✅ Update Expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        return expenseService.updateExpense(expense);
    }

    // ✅ Monthly Summary (NEW FEATURE 🔥)
    @GetMapping("/summary")
    public String getSummary(QueryRequest request) {
        return expenseService.getMonthlySummary(request.getQuestion());
    }
}