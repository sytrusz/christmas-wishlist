package com.wishlist.backend.service;

import com.wishlist.backend.dto.RegisterUserRequest;
import com.wishlist.backend.dto.UserDTO;
import com.wishlist.backend.model.User;
import com.wishlist.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByOrderByFullNameAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getUsersByCategory(User.UserCategory category) {
        return userRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserDTO registerUser(RegisterUserRequest request) {
        // Check if user already exists
        if (userRepository.existsByFullName(request.getFullName())) {
            throw new RuntimeException("User with this name already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setCategory(request.getCategory());
        
        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setCategory(user.getCategory());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return dto;
    }
}