package com.finance.service;

import java.util.List;

import com.finance.dto.CategorySummaryResponse;
import com.finance.dto.DashboardSummaryResponse;
import com.finance.dto.FinancialRecordResponse;
import com.finance.dto.MonthlyTrendResponse;

public interface DashboardService {

    DashboardSummaryResponse getDashboardSummary();

    List<CategorySummaryResponse> getCategoryTotals();

    List<FinancialRecordResponse> getRecentRecords();

    List<MonthlyTrendResponse> getMonthlyTrends();
}