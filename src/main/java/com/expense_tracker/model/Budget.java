package com.expense_tracker.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double monthlyLimit;

    private String month; // format: "2026-04"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}