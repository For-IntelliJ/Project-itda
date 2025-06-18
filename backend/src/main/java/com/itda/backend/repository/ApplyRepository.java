package com.itda.backend.repository;

import com.itda.backend.domain.Apply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {
    
    // 멘티 ID로 신청 내역 조회
    @Query("SELECT a FROM Apply a WHERE a.mentee.id = :menteeId")
    List<Apply> findByMenteeId(@Param("menteeId") Long menteeId);

    // 클래스 ID로 신청 내역 조회
    @Query("SELECT a FROM Apply a WHERE a.classEntity.id = :classId")
    List<Apply> findByClassEntityId(@Param("classId") Long classId);

    // 중복 신청 확인
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Apply a WHERE a.mentee.id = :menteeId AND a.classEntity.id = :classId")
    boolean existsByMenteeIdAndClassEntityId(@Param("menteeId") Long menteeId, @Param("classId") Long classId);

    // 특정 멘티의 특정 클래스 신청 내역 조회
    @Query("SELECT a FROM Apply a WHERE a.mentee.id = :menteeId AND a.classEntity.id = :classId")
    Optional<Apply> findByMenteeIdAndClassEntityId(@Param("menteeId") Long menteeId, @Param("classId") Long classId);
}