package com.wishlist.backend.dto;

import com.wishlist.backend.model.User;
import lombok.Data;
import java.util.List;

@Data
public class CreateWishlistRequest {
    private String ownerName;
    private String note;
    private User.UserCategory category;
    private List<ItemDTO> items;
}