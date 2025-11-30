package com.wishlist.backend.dto;

import lombok.Data;

@Data
public class ItemDTO {
    private Long id;
    private String itemName;
    private String description;  
    private String shopLink;
    private Long wishlistId;
}