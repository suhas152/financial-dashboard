package com.finance.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.finance.dto.CategorySummaryResponse;
import com.finance.dto.DashboardSummaryResponse;
import com.finance.dto.FinancialRecordResponse;
import com.finance.dto.MonthlyTrendResponse;
import com.finance.entity.FinancialRecord;
import com.finance.enums.RecordType;
import com.finance.repository.FinancialRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final FinancialRecordRepository financialRecordRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        BigDecimal totalIncome = financialRecordRepository.sumAmountByType(RecordType.INCOME);
        BigDecimal totalExpense = financialRecordRepository.sumAmountByType(RecordType.EXPENSE);
        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .build();
    }

    @Override
    public List<CategorySummaryResponse> getCategoryTotals() {
        List<Object[]> results = financialRecordRepository.getCategoryTotals();

        return results.stream()
                .map(row -> CategorySummaryResponse.builder()
                        .category((String) row[0])
                        .totalAmount((BigDecimal) row[1])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<FinancialRecordResponse> getRecentRecords() {
        return financialRecordRepository.findTop5ByOrderByDateDescIdDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyTrends() {
        List<Object[]> results = financialRecordRepository.getMonthlyTrends();

        return results.stream()
                .map(row -> MonthlyTrendResponse.builder()
                        .year((Integer) row[0])
                        .month((Integer) row[1])
                        .totalIncome((BigDecimal) row[2])
                        .totalExpense((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());
    }

    private FinancialRecordResponse mapToResponse(FinancialRecord record) {
        return FinancialRecordResponse.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .type(record.getType())
                .category(record.getCategory())
                .date(record.getDate())
                .notes(record.getNotes())
                .createdBy(record.getCreatedBy().getEmail())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}