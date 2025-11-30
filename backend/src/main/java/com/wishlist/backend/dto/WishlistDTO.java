package com.wishlist.backend.dto;

import com.wishlist.backend.model.User;
import lombok.Data;
import java.util.List;

@Data
public class WishlistDTO {
    private Long id;
    private String ownerName;
    private String uniqueSlug;
    private String note;
    private User.UserCategory category;
    private List<ItemDTO> items;
    private String createdAt;
    private String updatedAt;
}