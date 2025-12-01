package com.wishlist.backend.controller;

import com.wishlist.backend.model.SiteSetting;
import com.wishlist.backend.repository.SiteSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingRepository repository;
    private static final String HEADER_KEY = "header_title";

    @GetMapping("/header")
    public ResponseEntity<Map<String, String>> getHeaderTitle() {
        SiteSetting setting = repository.findById(HEADER_KEY)
                .orElse(new SiteSetting(HEADER_KEY, "Malagapo Christmas Wishlist"));
        
        return ResponseEntity.ok(Map.of("value", setting.getValue()));
    }

    @PutMapping("/header")
    public ResponseEntity<Void> updateHeaderTitle(@RequestBody Map<String, String> payload) {
        SiteSetting setting = new SiteSetting(HEADER_KEY, payload.get("value"));
        repository.save(setting);
        return ResponseEntity.ok().build();
    }
}