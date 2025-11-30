package com.wishlist.backend.controller;

import com.wishlist.backend.dto.CreateWishlistRequest;
import com.wishlist.backend.dto.UpdateWishlistRequest;
import com.wishlist.backend.dto.WishlistDTO;
import com.wishlist.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {
    
    private final WishlistService wishlistService;
    
    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getAllWishlists() {
        return ResponseEntity.ok(wishlistService.getAllWishlists());
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<WishlistDTO> getWishlistBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(wishlistService.getWishlistBySlug(slug));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<WishlistDTO>> searchWishlists(@RequestParam String name) {
        return ResponseEntity.ok(wishlistService.searchWishlistsByName(name));
    }
    
    @PostMapping
    public ResponseEntity<WishlistDTO> createWishlist(@RequestBody CreateWishlistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistService.createWishlist(request));
    }
    
    @PutMapping("/{slug}")
    public ResponseEntity<WishlistDTO> updateWishlist(
            @PathVariable String slug,
            @RequestBody UpdateWishlistRequest request) {
        return ResponseEntity.ok(wishlistService.updateWishlist(slug, request));
    }
    
    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable String slug) {
        wishlistService.deleteWishlist(slug);
        return ResponseEntity.noContent().build();
    }
}