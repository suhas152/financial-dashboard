package com.finance.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.finance.entity.FinancialRecord;
import com.finance.enums.RecordType;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    List<FinancialRecord> findByType(RecordType type);

    List<FinancialRecord> findByCategory(String category);

    List<FinancialRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<FinancialRecord> findByTypeAndCategoryAndDateBetween(
            RecordType type,
            String category,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinancialRecord> findByTypeAndDateBetween(
            RecordType type,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinancialRecord> findByCategoryAndDateBetween(
            String category,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinancialRecord> findTop5ByOrderByDateDescIdDesc();

    @Query("select coalesce(sum(fr.amount), 0) from FinancialRecord fr where fr.type = :type")
    BigDecimal sumAmountByType(RecordType type);

    @Query("""
           select fr.category, coalesce(sum(fr.amount), 0)
           from FinancialRecord fr
           group by fr.category
           order by coalesce(sum(fr.amount), 0) desc
           """)
    List<Object[]> getCategoryTotals();

    @Query("""
           select year(fr.date), month(fr.date),
                  coalesce(sum(case when fr.type = com.finance.enums.RecordType.INCOME then fr.amount else 0 end), 0),
                  coalesce(sum(case when fr.type = com.finance.enums.RecordType.EXPENSE then fr.amount else 0 end), 0)
           from FinancialRecord fr
           group by year(fr.date), month(fr.date)
           order by year(fr.date), month(fr.date)
           """)
    List<Object[]> getMonthlyTrends();
}