package com.expense_tracker.service;

import com.expense_tracker.model.Expense;
import com.expense_tracker.model.User;
import com.expense_tracker.repository.ExpenseRepository;
import com.expense_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroqService groqService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findByUser(getCurrentUser());
    }

    public Expense addExpense(Expense expense) {
        expense.setUser(getCurrentUser());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public String answerQuery(String question) {
        List<Expense> expenses = getAllExpenses();
        StringBuilder context = new StringBuilder();
        context.append("You are a smart expense tracking assistant. ");
        context.append("Answer the user's question naturally. ");
        context.append("If it's a greeting, respond in a friendly way. ");
        context.append("If it's about expenses, use the data below:\n\n");

        double total = 0;
        if (expenses.isEmpty()) {
            context.append("No expenses recorded yet.\n");
        } else {
            for (Expense e : expenses) {
                context.append("- Category: ").append(e.getCategory())
                        .append(", Amount: ₹").append(e.getAmount())
                        .append(", Date: ").append(e.getDate())
                        .append(", Description: ").append(e.getDescription())
                        .append("\n");
                total += e.getAmount();
            }
        }
        context.append("\nTotal Expenses: ₹").append(total);
        return groqService.ask(context.toString(), question);
    }

    public String getMonthlySummary(String question) {
        return answerQuery(question);
    }
}