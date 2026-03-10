package com.launchcode.moneymapbackend.repository;

import com.launchcode.moneymapbackend.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ExpenseRepository extends JpaRepository<Expenses, Long> {
    List<Expenses> findByUser(UserInfo user);
    List<Expenses>findByUserAndCategory(UserInfo user, String category);
    List<Expenses>findByUserAndDateBetween(UserInfo user, LocalDate start, LocalDate end);

}
