package com.wishlist.backend.repository;

import com.wishlist.backend.model.SiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {
    
}