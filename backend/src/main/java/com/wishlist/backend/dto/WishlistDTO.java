package com.wishlist.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class WishlistDTO {
    private Long id;
    private String ownerName;
    private String uniqueSlug;
    private String note;
    private List<ItemDTO> items;
    private String createdAt;
    private String updatedAt;
}