package com.wishlist.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

import com.wishlist.backend.dto.UserDTO;
import com.wishlist.backend.dto.WishlistDTO;
import com.wishlist.backend.dto.RegisterUserRequest;
import com.wishlist.backend.dto.UpdateUserRequest;
import com.wishlist.backend.dto.CreateWishlistRequest;
import com.wishlist.backend.dto.UpdateWishlistRequest;
import com.wishlist.backend.service.UserService;
import com.wishlist.backend.service.WishlistService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final WishlistService wishlistService;

    // CRUD Users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody RegisterUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // CRUD Notes/Wishlists
    @GetMapping("/wishlists")
    public ResponseEntity<List<WishlistDTO>> getAllWishlists() {
        return ResponseEntity.ok(wishlistService.getAllWishlists());
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

    @PostMapping("/header")
    public ResponseEntity<String> updateHeader(@RequestParam String headerName) {
        return ResponseEntity.ok("Header updated to: " + headerName);
    }
}