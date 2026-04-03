package com.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.finance.enums.RecordType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FinancialRecordRequest {

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private RecordType type;

    @NotBlank
    private String category;

    @NotNull
    private LocalDate date;

    private String notes;
}