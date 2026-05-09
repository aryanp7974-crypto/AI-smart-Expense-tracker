package com.expense_tracker.repository;

import com.expense_tracker.model.Budget;
import com.expense_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserAndMonth(User user, String month);
}