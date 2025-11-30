package com.wishlist.backend.dto;

import com.wishlist.backend.model.User;
import lombok.Data;

@Data
public class RegisterUserRequest {
    private String fullName;
    private User.UserCategory category;
}