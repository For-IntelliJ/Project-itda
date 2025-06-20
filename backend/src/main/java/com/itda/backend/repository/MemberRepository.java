package com.itda.backend.repository;

import com.itda.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);

    //닉네임과 카카오id
    boolean existsByNickname(String nickname);
    boolean existsByKakaoId(String kakaoId);

    //내 카카오id DB에서 찾기
    Optional<Member> findByKakaoId(String kakaoId);
}

