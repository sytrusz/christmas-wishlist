package com.wishlist.backend.dto;

import com.wishlist.backend.model.User;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private User.UserCategory category;
    private String createdAt;
}