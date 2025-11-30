package com.wishlist.backend.service;

import com.wishlist.backend.dto.ItemDTO;
import com.wishlist.backend.model.Wishlist;
import com.wishlist.backend.model.WishlistItem;
import com.wishlist.backend.repository.ItemRepository;
import com.wishlist.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final WishlistRepository wishlistRepository;
    
    public List<ItemDTO> getItemsByWishlistId(Long wishlistId) {
        return itemRepository.findByWishlistId(wishlistId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ItemDTO addItemToWishlist(String slug, ItemDTO itemDTO) {
        Wishlist wishlist = wishlistRepository.findByUniqueSlug(slug)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));
        
        WishlistItem item = new WishlistItem();
        item.setItemName(itemDTO.getItemName());
        item.setShopLink(itemDTO.getShopLink());
        item.setWishlist(wishlist);
        
        WishlistItem saved = itemRepository.save(item);
        return convertToDTO(saved);
    }
    
    @Transactional
    public ItemDTO updateItem(Long itemId, ItemDTO itemDTO) {
        WishlistItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setItemName(itemDTO.getItemName());
        item.setShopLink(itemDTO.getShopLink());
        
        WishlistItem updated = itemRepository.save(item);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteItem(Long itemId) {
        WishlistItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemRepository.delete(item);
    }
    
    private ItemDTO convertToDTO(WishlistItem item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setShopLink(item.getShopLink());
        dto.setWishlistId(item.getWishlist().getId());
        return dto;
    }
}