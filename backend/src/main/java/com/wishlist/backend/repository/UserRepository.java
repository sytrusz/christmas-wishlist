package com.wishlist.backend.repository;

import com.wishlist.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByFullName(String fullName);
    boolean existsByFullName(String fullName);
    List<User> findByCategory(User.UserCategory category);
    List<User> findAllByOrderByFullNameAsc();
}