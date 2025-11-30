package com.wishlist.backend.service;

import com.wishlist.backend.dto.CreateWishlistRequest;
import com.wishlist.backend.dto.ItemDTO;
import com.wishlist.backend.dto.UpdateWishlistRequest;
import com.wishlist.backend.dto.WishlistDTO;
import com.wishlist.backend.model.Wishlist;
import com.wishlist.backend.model.WishlistItem;
import com.wishlist.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {
    
    private final WishlistRepository wishlistRepository;
    
    public List<WishlistDTO> getAllWishlists() {
        return wishlistRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public WishlistDTO getWishlistBySlug(String slug) {
        Wishlist wishlist = wishlistRepository.findByUniqueSlug(slug)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));
        return convertToDTO(wishlist);
    }
    
    public List<WishlistDTO> searchWishlistsByName(String name) {
        return wishlistRepository.findByOwnerNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public WishlistDTO createWishlist(CreateWishlistRequest request) {
        Wishlist wishlist = new Wishlist();
        wishlist.setOwnerName(request.getOwnerName());
        wishlist.setNote(request.getNote());
        wishlist.setUniqueSlug(generateUniqueSlug(request.getOwnerName()));
        
        // Add items
        if (request.getItems() != null) {
            for (ItemDTO itemDTO : request.getItems()) {
                WishlistItem item = new WishlistItem();
                item.setItemName(itemDTO.getItemName());
                item.setShopLink(itemDTO.getShopLink());
                item.setWishlist(wishlist);
                wishlist.getItems().add(item);
            }
        }
        
        Wishlist saved = wishlistRepository.save(wishlist);
        return convertToDTO(saved);
    }
    
    @Transactional
    public WishlistDTO updateWishlist(String slug, UpdateWishlistRequest request) {
        Wishlist wishlist = wishlistRepository.findByUniqueSlug(slug)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));
        
        wishlist.setNote(request.getNote());
        Wishlist updated = wishlistRepository.save(wishlist);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteWishlist(String slug) {
        Wishlist wishlist = wishlistRepository.findByUniqueSlug(slug)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));
        wishlistRepository.delete(wishlist);
    }
    
    private String generateUniqueSlug(String ownerName) {
        String baseSlug = ownerName.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        
        String slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);
        
        // Ensure uniqueness
        while (wishlistRepository.existsByUniqueSlug(slug)) {
            slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }
        
        return slug;
    }
    
    private WishlistDTO convertToDTO(Wishlist wishlist) {
        WishlistDTO dto = new WishlistDTO();
        dto.setId(wishlist.getId());
        dto.setOwnerName(wishlist.getOwnerName());
        dto.setUniqueSlug(wishlist.getUniqueSlug());
        dto.setNote(wishlist.getNote());
        dto.setCreatedAt(wishlist.getCreatedAt() != null ? wishlist.getCreatedAt().toString() : null);
        dto.setUpdatedAt(wishlist.getUpdatedAt() != null ? wishlist.getUpdatedAt().toString() : null);
        
        List<ItemDTO> itemDTOs = wishlist.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);
        
        return dto;
    }
    
    private ItemDTO convertItemToDTO(WishlistItem item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setShopLink(item.getShopLink());
        dto.setWishlistId(item.getWishlist().getId());
        return dto;
    }
}