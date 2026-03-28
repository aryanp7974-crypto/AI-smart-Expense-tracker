package com.expense_tracker.service;

import com.expense_tracker.model.Expense;
import com.expense_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public String getMonthlySummary() {
        List<Expense> expenses = expenseRepository.findAll();
        double total = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
        return "Total expenses this month: ₹" + total;
    }
}