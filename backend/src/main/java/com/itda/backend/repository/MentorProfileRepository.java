package com.itda.backend.repository;

import com.itda.backend.domain.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {
    MentorProfile findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}