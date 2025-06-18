package com.itda.backend.repository;

import com.itda.backend.domain.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
    
    /**
     * 모든 관계 데이터를 포함하여 클래스 조회
     * member, mentor_profile, category, region을 모두 JOIN FETCH
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN FETCH c.mentor m 
        LEFT JOIN FETCH m.mentorProfile mp 
        LEFT JOIN FETCH c.category cat 
        LEFT JOIN FETCH c.region r 
        WHERE m.role = 'MENTOR'
        ORDER BY c.id
        """)
    List<ClassEntity> findAllWithRelations();
    
    /**
     * 특정 ID의 클래스를 모든 관계 데이터와 함께 조회
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN FETCH c.mentor m 
        LEFT JOIN FETCH m.mentorProfile mp 
        LEFT JOIN FETCH c.category cat 
        LEFT JOIN FETCH c.region r 
        WHERE c.id = :id AND m.role = 'MENTOR'
        """)
    Optional<ClassEntity> findByIdWithRelations(Long id);
    
    /**
     * 특정 멘토의 클래스들 조회
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN FETCH c.mentor m 
        LEFT JOIN FETCH m.mentorProfile mp 
        LEFT JOIN FETCH c.category cat 
        LEFT JOIN FETCH c.region r 
        WHERE m.id = :mentorId AND m.role = 'MENTOR'
        ORDER BY c.id
        """)
    List<ClassEntity> findByMentorIdWithRelations(Long mentorId);
    
    /**
     * 특정 카테고리의 클래스들 조회
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN FETCH c.mentor m 
        LEFT JOIN FETCH m.mentorProfile mp 
        LEFT JOIN FETCH c.category cat 
        LEFT JOIN FETCH c.region r 
        WHERE cat.id = :categoryId AND m.role = 'MENTOR'
        ORDER BY c.id
        """)
    List<ClassEntity> findByCategoryIdWithRelations(Long categoryId);
    
    /**
     * 특정 지역의 클래스들 조회
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN FETCH c.mentor m 
        LEFT JOIN FETCH m.mentorProfile mp 
        LEFT JOIN FETCH c.category cat 
        LEFT JOIN FETCH c.region r 
        WHERE r.id = :regionId AND m.role = 'MENTOR'
        ORDER BY c.id
        """)
    List<ClassEntity> findByRegionIdWithRelations(Long regionId);
    
    /**
     * 관계 데이터가 누락된 클래스들 확인 (디버깅용)
     */
    @Query("""
        SELECT c FROM ClassEntity c 
        LEFT JOIN c.mentor m 
        LEFT JOIN c.category cat 
        LEFT JOIN c.region r 
        WHERE m IS NULL OR cat IS NULL OR r IS NULL OR m.role != 'MENTOR'
        """)
    List<ClassEntity> findClassesWithMissingRelations();
}