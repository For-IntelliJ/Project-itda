package com.itda.backend.repository;

import com.itda.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);

    boolean existsByNickname(String nickname);
    boolean existsByKakaoId(String kakaoId);
}