package com.finance.dto;

import com.finance.enums.UserStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {

    @NotNull
    private UserStatus status;
}