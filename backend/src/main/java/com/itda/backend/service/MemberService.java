package com.itda.backend.service;

import com.itda.backend.dto.MemberLoginRequestDto;
import com.itda.backend.mapper.MemberMapper;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberResponseDto;
import com.itda.backend.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MemberService {
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 회원가입
    public MemberResponseDto join(MemberJoinRequestDto dto) {
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        Member member = MemberMapper.toEntity(dto);
        log.debug("🧾 회원가입 요청: {}", member.getEmail());

        Member saved = memberRepository.save(member);
        return MemberMapper.toDto(saved);
    }

    // 로그인
    public Member login(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));

        if (!member.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        log.info("🔓 로그인 성공: {}", email);
        return member;
    }

    public Member login(MemberLoginRequestDto dto) {
        return login(dto.getEmail(), dto.getPassword());
    }

    public boolean changePassword(Long memberId, String currentPw, String newPw) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 평문 비교인 경우:
        if (!member.getPassword().equals(currentPw)) {
            return false;
        }

        member.setPassword(newPw); // 비밀번호 변경
        memberRepository.save(member); // DB에 반영

        return true;
    }
}
