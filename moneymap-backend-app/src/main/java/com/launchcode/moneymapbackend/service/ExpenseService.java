package com.launchcode.moneymapbackend.service;

import com.launchcode.moneymapbackend.models.Expenses;
import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
// This service class encapsulates the business logic for managing expenses, providing methods to add, retrieve, update, and delete expenses
// while ensuring that operations are performed in the context of the authenticated user.
@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expenses addExpense(UserInfo user, Expenses expense) {
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public List<Expenses> getUserExpenses(UserInfo user) {
        return expenseRepository.findByUser(user);
    }

    public List<Expenses> getExpensesByCategory(UserInfo user, String category) {
        return expenseRepository.findByUserAndCategory(user, category);
    }

    public List<Expenses> getExpensesByDateRange(UserInfo user, LocalDate start, LocalDate end) {
        return expenseRepository.findByUserAndDateBetween(user, start, end);
    }

    public Expenses updateExpense(Expenses expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}