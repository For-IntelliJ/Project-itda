package com.itda.backend.service;

import com.itda.backend.domain.enums.LoginType;
import com.itda.backend.domain.enums.Role;
import com.itda.backend.dto.MemberLoginRequestDto;
import com.itda.backend.mapper.MemberMapper;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberResponseDto;
import com.itda.backend.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // 비밀번호 변경
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

    //별명과 카카오 id를 받아서 회원저장
    /*// 기존: MemberResponseDto 반환
    public MemberResponseDto joinWithKakao(String kakaoId, String nickname) {
        if (memberRepository.existsByKakaoId(kakaoId)) {
            throw new IllegalArgumentException("이미 가입된 카카오 계정입니다.");
        }

        if (memberRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 사용 중인 별명입니다.");
        }

        Member member = Member.builder()
                .kakaoId(kakaoId)
                .nickname(nickname)
                .loginType(LoginType.KAKAO)
                .role(Role.MENTEE)
                .email("kakao_" + kakaoId + "@kakao.com")  // 임시 이메일
                .username(nickname)  // 임시 사용자명으로 닉네임 사용
                .phone("000-0000-0000")  // 임시 번호
                .build();

        log.debug("🟡 카카오 회원가입 요청: kakaoId={}, nickname={}", kakaoId, nickname);

        Member saved = memberRepository.save(member);
        return MemberMapper.toDto(saved);
    }
*/
    //별명과 카카오 id를 받아서 회원저장 (Member 반환해서 세션저장용 -> 그래야 로그인 가능)
    public Member joinWithKakaoReturnMember(String kakaoId, String nickname) {
        if (memberRepository.existsByKakaoId(kakaoId)) {
            throw new IllegalArgumentException("이미 가입된 카카오 계정입니다.");
        }

        if (memberRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 사용 중인 별명입니다.");
        }

        Member member = Member.builder()
                .kakaoId(kakaoId)
                .nickname(nickname)
                .loginType(LoginType.KAKAO)
                .role(Role.MENTEE)
                .email("kakao_" + kakaoId + "@kakao.com")
                .username(nickname)
                .phone("000-0000-0000")  // 임시 번호
                .build();

        log.debug("🟡 카카오 회원가입 요청 (Member 반환): kakaoId={}, nickname={}", kakaoId, nickname);

        return memberRepository.save(member);
    }

    //카카로 회원가입 유무 확인
    public boolean existsByKakaoId(String kakaoId) {
        return memberRepository.existsByKakaoId(kakaoId);
    }

    //카카오 id찾아오기 우리 DB에 저장된거
    public Member findByKakaoId(String kakaoId) {
        return memberRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카카오 ID의 사용자를 찾을 수 없습니다."));
    }
    
    // ID로 회원 찾기
    public Member findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다."));
    }

    // 회원 탈퇴
    @Transactional
    public void deleteMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));

        memberRepository.delete(member); // 실제 삭제
    }




}
