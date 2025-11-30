package com.wishlist.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateWishlistRequest {
    private String ownerName;
    private String note;
    private List<ItemDTO> items;
}