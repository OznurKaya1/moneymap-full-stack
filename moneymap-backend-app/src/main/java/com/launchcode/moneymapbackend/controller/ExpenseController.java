package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.models.Expenses;
import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.ExpenseRepository;
import com.launchcode.moneymapbackend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    // Create a new expense
    @PostMapping("/{userId}")
    public ResponseEntity<Expenses> addExpense(@PathVariable Long userId, @RequestBody Expenses expense) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        expense.setUser(user);
        Expenses savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    // Get all expenses for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Expenses>> getUserExpenses(@PathVariable Long userId) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expenses> expenses = expenseRepository.findByUser(user);
        return ResponseEntity.ok(expenses);
    }

    // Filter expenses by category
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<List<Expenses>> getExpensesByCategory(@PathVariable Long userId,
                                                                @PathVariable String category) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expenses> expenses = expenseRepository.findByUserAndCategory(user, category);
        return ResponseEntity.ok(expenses);
    }

    // Filter expenses by date
    @GetMapping("/{userId}/dates")
    public ResponseEntity<List<Expenses>> getExpensesByDateRange(@PathVariable Long userId,
                                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expenses> expenses = expenseRepository.findByUserAndDateBetween(user, start, end);
        return ResponseEntity.ok(expenses);
    }

    // Delete an expense
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId) {
        expenseRepository.deleteById(expenseId);
        return ResponseEntity.noContent().build();
    }

    // Update an expense
    @PutMapping("/{expenseId}")
    public ResponseEntity<Expenses> updateExpense(@PathVariable Long expenseId,
                                                  @RequestBody Expenses expenseDetails) {
        Expenses expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        expense.setDescription(expenseDetails.getDescription());
        expense.setCategory(expenseDetails.getCategory());

        Expenses updatedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(updatedExpense);
    }
}