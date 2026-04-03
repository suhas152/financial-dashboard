package com.finance.service;

import java.util.List;

import com.finance.dto.UpdateUserRoleRequest;
import com.finance.dto.UpdateUserStatusRequest;
import com.finance.dto.UserResponse;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUserRole(Long id, UpdateUserRoleRequest request);

    UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request);
}