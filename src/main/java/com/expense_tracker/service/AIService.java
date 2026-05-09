package com.expense_tracker.service;

import com.expense_tracker.model.Expense;
import com.expense_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroqService groqService;

    public String answerQuery(String question) {
        if (question == null || question.isBlank()) {
            return "Please ask a valid question.";
        }

        List<Expense> expenses = expenseRepository.findAll();

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
}