package com.itda.backend.service;

import com.itda.backend.MemberMapper;
import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.LoginType;
import com.itda.backend.domain.enums.Role;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberResponseDto;
import com.itda.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

// 회원가입/로그인 기능을 처리하는 서비스 계층 클래스
// 주로 컨트롤러에서 호출되며, DB와의 직접적인 작업은 Repository를 통해 수행
@Service
public class MemberService {
    private final MemberRepository memberRepository; // 회원 정보에 접근하는 Repository 객체

    // 생성자 주입을 통해 Repository 의존성을 설정
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 1. 로컬 회원가입처리 메소드
    public MemberResponseDto join(MemberJoinRequestDto dto) {
        // 1. 이메일 중복 체크
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        // 2. DTO → Entity 변환
        Member member = MemberMapper.toEntity(dto);
        System.out.println("[DEBUG] 저장 직전 loginType: " + member.getLoginType());
        // 3. Entity 저장 (DB에 저장)
        Member saved = memberRepository.save(member);
        // 4. Entity → Response DTO로 변환 후 반환
        return MemberMapper.toDto(saved);
    }

    // 2. 로컬 로그인 처리 메소드
    public Member login(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));

        if (!member.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    // 3. 카카오 로그인 처리
    public Member findOrCreateByKakaoId(String kakaoId, String email, String nickname) {
        return memberRepository.findByKakaoId(kakaoId).orElseGet(() -> {
            Member member = new Member();
            member.setKakaoId(kakaoId);
            member.setEmail(email);
            member.setNickname(generateUniqueNickname(nickname));
            member.setLoginType(LoginType.KAKAO);
            member.setRole(Role.MENTEE);
            member.setUsername("카카오_" + (kakaoId.length() >= 4 ? kakaoId.substring(kakaoId.length() - 4) : UUID.randomUUID().toString().substring(0, 4)));
            member.setPhone("000-0000-0000");
            return memberRepository.save(member);
        });
    }

    private String generateUniqueNickname(String base) {
        return base + "_" + UUID.randomUUID().toString().substring(0, 6);
    }


}
