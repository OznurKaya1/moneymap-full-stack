package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.models.Income;
import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.IncomeRepository;
import com.launchcode.moneymapbackend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//
@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    // Create income for a specific user
    @PostMapping("/{userId}")
    public ResponseEntity<Income> addIncome(@PathVariable Long userId, @RequestBody Income income) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        income.setUser(user);
        Income savedIncome = incomeRepository.save(income);
        return ResponseEntity.ok(savedIncome);
    }

    // Update income
    @PutMapping("/{userId}/{incomeId}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long userId,
                                               @PathVariable Long incomeId,
                                               @RequestBody Income incomeDetails) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // forbid updates to others' income
        }

        income.setAmount(incomeDetails.getAmount());
        income.setDate(incomeDetails.getDate());
        income.setDescription(incomeDetails.getDescription());

        Income updatedIncome = incomeRepository.save(income);
        return ResponseEntity.ok(updatedIncome);
    }

    // Delete income
    @DeleteMapping("/{userId}/{incomeId}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long userId,
                                             @PathVariable Long incomeId) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // forbid deleting others' income
        }

        incomeRepository.delete(income);
        return ResponseEntity.noContent().build();
    }

    // Get all incomes for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Income>> getAllIncomes(@PathVariable Long userId) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Income> incomes = incomeRepository.findByUser(user);
        return ResponseEntity.ok(incomes);
    }
}