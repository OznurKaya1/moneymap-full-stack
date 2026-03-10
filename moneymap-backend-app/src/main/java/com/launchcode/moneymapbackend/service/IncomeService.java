package com.launchcode.moneymapbackend.service;

import com.launchcode.moneymapbackend.models.Income;
import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    // Add new income
    public Income addIncome(Income income) {
        return incomeRepository.save(income);
    }

    // Update existing income
    public Income updateIncome(Long id, Income updatedIncome) {
        Optional<Income> existing = incomeRepository.findById(id);
        if (existing.isPresent()) {
            Income income = existing.get();
            income.setDate(updatedIncome.getDate());
            income.setAmount(updatedIncome.getAmount());
            income.setDescription(updatedIncome.getDescription());
            income.setCategory(updatedIncome.getCategory());
            return incomeRepository.save(income);
        } else {
            throw new RuntimeException("Income not found with id: " + id);
        }
    }

    // Delete income
    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }

    // Get all incomes for a user
    public List<Income> getAllByUser(UserInfo user) {
        return incomeRepository.findByUser(user);
    }

    // Filter by category
    public List<Income> getByUserAndCategory(UserInfo user, String category) {
        return incomeRepository.findByUserAndCategory(user, category);
    }

    // Filter by date range
    public List<Income> getByUserAndDateBetween(UserInfo user, LocalDate start, LocalDate end) {
        return incomeRepository.findByUserAndDateBetween(user, start, end);
    }

}