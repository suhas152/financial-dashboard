package com.finance.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.dto.CategorySummaryResponse;
import com.finance.dto.DashboardSummaryResponse;
import com.finance.dto.FinancialRecordResponse;
import com.finance.dto.MonthlyTrendResponse;
import com.finance.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','VIEWER')")
    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','VIEWER')")
    @GetMapping("/category-totals")
    public List<CategorySummaryResponse> getCategoryTotals() {
        return dashboardService.getCategoryTotals();
    }

    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','VIEWER')")
    @GetMapping("/recent")
    public List<FinancialRecordResponse> getRecentRecords() {
        return dashboardService.getRecentRecords();
    }

    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','VIEWER')")
    @GetMapping("/monthly-trends")
    public List<MonthlyTrendResponse> getMonthlyTrends() {
        return dashboardService.getMonthlyTrends();
    }
}