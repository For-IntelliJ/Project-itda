package com.itda.backend.repository;

import com.itda.backend.domain.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {
    
    // user.id로 조회 (외래키 참조)
    @Query("SELECT mp FROM MentorProfile mp WHERE mp.user.id = :userId")
    MentorProfile findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(mp) > 0 FROM MentorProfile mp WHERE mp.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
}