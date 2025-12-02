package com.wishlist.backend.controller;

import com.wishlist.backend.dto.CreateWishlistRequest;
import com.wishlist.backend.dto.UpdateWishlistRequest;
import com.wishlist.backend.dto.WishlistDTO;
import com.wishlist.backend.model.User;
import com.wishlist.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/wishlists")
    public ResponseEntity<List<WishlistDTO>> getAllWishlists(Authentication auth) {
        return ResponseEntity.ok(wishlistService.getAllWishlists());
    }

    @GetMapping("/wishlists/{slug}")
    public ResponseEntity<WishlistDTO> getWishlistBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(wishlistService.getWishlistBySlug(slug));
    }

    @PostMapping("/wishlists")
    public ResponseEntity<WishlistDTO> createWishlist(@RequestBody CreateWishlistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistService.createWishlist(request));
    }

    @PutMapping("/wishlists/{slug}")
    public ResponseEntity<WishlistDTO> updateWishlist(@PathVariable String slug, @RequestBody UpdateWishlistRequest request) {
        return ResponseEntity.ok(wishlistService.updateWishlist(slug, request));
    }

    @DeleteMapping("/wishlists/{id}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable Long id) {
        wishlistService.deleteWishlistById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }
}