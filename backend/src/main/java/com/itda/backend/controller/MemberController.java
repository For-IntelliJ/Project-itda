package com.itda.backend.controller;

import com.itda.backend.domain.Member;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberLoginRequestDto;
import com.itda.backend.dto.MemberResponseDto;
import com.itda.backend.dto.PasswordChangeRequestDto;
import com.itda.backend.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<MemberResponseDto> join(@RequestBody MemberJoinRequestDto dto) {
        MemberResponseDto result = memberService.join(dto);
        return ResponseEntity.ok(result);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginRequestDto dto, HttpSession session) {
        try {
            Member member = memberService.login(dto);
            session.setAttribute("loginUser", member);
            return ResponseEntity.ok("로그인 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // 로그 남기기
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    // 세션 정보 확인 (개발용)
    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo(HttpSession session) {
        String sessionId = session.getId();
        int timeout = session.getMaxInactiveInterval();
        Object loginUser = session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        return ResponseEntity.ok("세션 ID: " + sessionId + ", 유지 시간: " + timeout + "초");
    }

    // 현재 로그인된 유저 정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        System.out.println("🧪 /me 요청 → 세션 ID: " + session.getId());
        System.out.println("🧪 /me 요청 → 세션 유저: " + session.getAttribute("loginUser"));

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다");
        }

        // 순환 참조 방지를 위해 단순한 Map 반환
        Map<String, Object> response = new HashMap<>();
        response.put("id", loginUser.getId());
        response.put("nickname", loginUser.getNickname());
        response.put("username", loginUser.getUsername());
        response.put("email", loginUser.getEmail());
        response.put("role", loginUser.getRole().toString());
        response.put("loginType", loginUser.getLoginType().toString());
        response.put("createdAt", loginUser.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        if (session != null) {
            session.invalidate(); // 세션이 있으면 제거
        }
        return ResponseEntity.ok("로그아웃 처리 완료");
    }

    // 비밀번호 변경
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequestDto dto, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        boolean changed = memberService.changePassword(loginUser.getId(), dto.getCurrentPassword(), dto.getNewPassword());

        if (!changed) {
            return ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다.");
        }

        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    // 회원탈퇴
    @PostMapping("/delete")
    public ResponseEntity<?> deleteAccount(HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        memberService.deleteMember(loginUser.getId());
        session.invalidate();
        return ResponseEntity.ok("탈퇴가 완료되었습니다.");
    }


}
