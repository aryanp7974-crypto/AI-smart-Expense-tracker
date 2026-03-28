package com.expense_tracker.repository;

import com.expense_tracker.model.Expense;
import com.expense_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    static List<Expense> findByDateBetween(LocalDate start, LocalDate end) {
        return null;
    }

}