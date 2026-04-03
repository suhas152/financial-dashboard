package com.finance.dto;

import com.finance.enums.Role;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {

    @NotNull
    private Role role;
}