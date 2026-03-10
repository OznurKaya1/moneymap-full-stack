package com.launchcode.moneymapbackend.controller;

import com.launchcode.moneymapbackend.models.Income;
import com.launchcode.moneymapbackend.models.UserInfo;
import com.launchcode.moneymapbackend.service.IncomeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    // Add income
    @PostMapping
    public Income addIncome(@RequestBody Income income, @AuthenticationPrincipal UserDetails userDetails) {
        // Set the logged-in user
        income.setUser((UserInfo) userDetails); // adjust based on your UserDetails implementation
        return incomeService.addIncome(income);
    }

    // Update income
    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income income) {
        return incomeService.updateIncome(id, income);
    }

    // Delete income
    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }

    // Get all incomes for logged-in user
    @GetMapping
    public List<Income> getAllIncomes(@AuthenticationPrincipal UserDetails userDetails) {
        return incomeService.getAllByUser((UserInfo) userDetails);
    }

    // Filter by category
    @GetMapping("/category/{category}")
    public List<Income> getByCategory(@PathVariable String category,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        return incomeService.getByUserAndCategory((UserInfo) userDetails, category);
    }

    // Filter by date
    @GetMapping("/filter")
    public List<Income> getByDateRange(@RequestParam String start,
                                       @RequestParam String end,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return incomeService.getByUserAndDateBetween((UserInfo) userDetails, startDate, endDate);
    }
}