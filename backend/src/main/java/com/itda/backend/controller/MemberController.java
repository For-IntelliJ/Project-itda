package com.itda.backend.controller;

import com.itda.backend.domain.Member;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberLoginRequestDto;
import com.itda.backend.dto.MemberResponseDto;
import com.itda.backend.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// REST API 요청을 받아 회원 관련 요청을 처리하는 컨트롤러 클래스
@RestController
@RequestMapping("/api/member")
public class MemberController {
    private final MemberService memberService;

    // 생성자를 통해 MemberService 주입
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 회원가입 요청 처리
    @PostMapping("/join")
    public ResponseEntity<MemberResponseDto> join(@RequestBody MemberJoinRequestDto dto) {
        MemberResponseDto result = memberService.join(dto); // 서비스 호출로 회원가입 처리
        return ResponseEntity.ok(result); // 가입된 회원 정보 반환
    }

    // 로그인 요청 처리
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody MemberLoginRequestDto loginDto, HttpSession session) {
        Member member = memberService.login(loginDto.getEmail(), loginDto.getPassword());
        session.setAttribute("loginUser", member.getId()); // 로그인 사용자 ID를 세션에 저장
        return ResponseEntity.ok("로그인 성공");
    }
}

