package com.wishlist.backend.controller;

import com.wishlist.backend.dto.ItemDTO;
import com.wishlist.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemController {
    
    private final ItemService itemService;
    
    @PostMapping("/wishlists/{slug}/items")
    public ResponseEntity<ItemDTO> addItemToWishlist(
            @PathVariable String slug,
            @RequestBody ItemDTO itemDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itemService.addItemToWishlist(slug, itemDTO));
    }
    
    @PutMapping("/items/{id}")
    public ResponseEntity<ItemDTO> updateItem(
            @PathVariable Long id,
            @RequestBody ItemDTO itemDTO) {
        return ResponseEntity.ok(itemService.updateItem(id, itemDTO));
    }
    
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}