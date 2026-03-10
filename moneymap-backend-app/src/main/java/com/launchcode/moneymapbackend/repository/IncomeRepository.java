package com.launchcode.moneymapbackend.repository;

import com.launchcode.moneymapbackend.models.Income;
import com.launchcode.moneymapbackend.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser(UserInfo user);
    List<Income> findByUserAndCategory(UserInfo user, String category);
    List<Income> findByUserAndDateBetween(UserInfo user, LocalDate start, LocalDate end);
}