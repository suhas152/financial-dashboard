package com.finance.service;

import java.util.List;

import com.finance.dto.FinancialRecordRequest;
import com.finance.dto.FinancialRecordResponse;

public interface FinancialRecordService {

    FinancialRecordResponse createRecord(FinancialRecordRequest request, String userEmail);

    List<FinancialRecordResponse> getAllRecords();

    FinancialRecordResponse getRecordById(Long id);

    FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request);

    void deleteRecord(Long id);

    List<FinancialRecordResponse> filterRecords(String type, String category, String startDate, String endDate);
}