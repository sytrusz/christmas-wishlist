package com.wishlist.backend.dto;

import com.wishlist.backend.model.User;

public class UpdateUserRequest {
    private String fullName;
    private User.UserCategory category;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public User.UserCategory getCategory() { return category; }
    public void setCategory(User.UserCategory category) { this.category = category; }
}