package com.launchcode.moneymapbackend.repository;

import com.launchcode.moneymapbackend.models.Expenses;
import com.launchcode.moneymapbackend.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expenses, Long> {

    // Find all expenses by a specific user
    List<Expenses> findByUser(UserInfo user);

    // Find all expenses by user and category
    List<Expenses> findByUserAndCategory(UserInfo user, String category);

    // Find all expenses by user within a date range
    List<Expenses> findByUserAndDateBetween(UserInfo user, LocalDate start, LocalDate end);
}