package com.expense_tracker.service;

import com.expense_tracker.model.Budget;
import com.expense_tracker.model.Expense;
import com.expense_tracker.model.User;
import com.expense_tracker.repository.BudgetRepository;
import com.expense_tracker.repository.ExpenseRepository;
import com.expense_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public Budget setBudget(double limit, String month) {
        User user = getCurrentUser();
        Optional<Budget> existing = budgetRepository.findByUserAndMonth(user, month);
        Budget budget = existing.orElse(new Budget());
        budget.setMonthlyLimit(limit);
        budget.setMonth(month);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    public BudgetStatus getBudgetStatus(String month) {
        User user = getCurrentUser();
        Optional<Budget> budgetOpt = budgetRepository.findByUserAndMonth(user, month);

        if (budgetOpt.isEmpty()) {
            return new BudgetStatus(0, 0, false, false);
        }

        Budget budget = budgetOpt.get();
        List<Expense> expenses = expenseRepository.findByUser(user);

        double spent = expenses.stream()
                .filter(e -> (e.getDate() != null && e.getDate().toString().startsWith(month)))
                .mapToDouble(Expense::getAmount)
                .sum();

        double limit = budget.getMonthlyLimit();
        boolean exceeded = spent > limit;
        boolean warning = spent >= limit * 0.8 && !exceeded;

        return new BudgetStatus(limit, spent, exceeded, warning);
    }

    public record BudgetStatus(double limit, double spent, boolean exceeded, boolean warning) {}
}