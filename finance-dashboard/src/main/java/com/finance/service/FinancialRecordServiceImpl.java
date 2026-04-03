package com.finance.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.finance.dto.FinancialRecordRequest;
import com.finance.dto.FinancialRecordResponse;
import com.finance.entity.FinancialRecord;
import com.finance.entity.User;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.FinancialRecordRepository;
import com.finance.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FinancialRecordServiceImpl implements FinancialRecordService {

    private final FinancialRecordRepository financialRecordRepository;
    private final UserRepository userRepository;

    @Override
    public FinancialRecordResponse createRecord(FinancialRecordRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FinancialRecord record = FinancialRecord.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .notes(request.getNotes())
                .createdBy(user)
                .build();

        FinancialRecord savedRecord = financialRecordRepository.save(record);
        return mapToResponse(savedRecord);
    }

    @Override
    public List<FinancialRecordResponse> getAllRecords() {
        return financialRecordRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FinancialRecordResponse getRecordById(Long id) {
        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found"));
        return mapToResponse(record);
    }

    @Override
    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request) {
        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found"));

        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setNotes(request.getNotes());

        FinancialRecord updatedRecord = financialRecordRepository.save(record);
        return mapToResponse(updatedRecord);
    }

    @Override
    public void deleteRecord(Long id) {
        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found"));

        financialRecordRepository.delete(record);
    }

    @Override
    public List<FinancialRecordResponse> filterRecords(String type, String category, String startDate, String endDate) {
        List<FinancialRecord> records = financialRecordRepository.findAll();

        if (type != null && !type.isBlank()) {
            records = records.stream()
                    .filter(record -> record.getType().name().equalsIgnoreCase(type))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isBlank()) {
            records = records.stream()
                    .filter(record -> record.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (startDate != null && !startDate.isBlank()) {
            LocalDate start = LocalDate.parse(startDate);
            records = records.stream()
                    .filter(record -> !record.getDate().isBefore(start))
                    .collect(Collectors.toList());
        }

        if (endDate != null && !endDate.isBlank()) {
            LocalDate end = LocalDate.parse(endDate);
            records = records.stream()
                    .filter(record -> !record.getDate().isAfter(end))
                    .collect(Collectors.toList());
        }

        return records.stream()
                .map(this::mapToResponse)
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