package com.itda.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

import com.itda.backend.dto.KakaoUserInfo;
import com.itda.backend.service.KakaoService;
import com.itda.backend.service.MemberService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itda.backend.domain.Member;




@RestController
@RequestMapping("/auth/kakao")
public class KakaoController {

    private final KakaoService kakaoService;
    private final MemberService memberService;

    public KakaoController(KakaoService kakaoService, MemberService memberService) {
        this.kakaoService = kakaoService;
        this.memberService = memberService;
    }

    //카카오 콜백 인증코드 받음
    @GetMapping("/callback")
    public void kakaoCallback(@RequestParam(required = false) String code, HttpServletResponse response, HttpSession session) throws IOException {
        System.out.println("🔑 카카오 인증 코드: " + code);

        if (code == null || code.isEmpty()) {
            System.out.println("❌ 인증 코드 없음! 로그인 실패 처리");
            response.sendRedirect("http://localhost:3000/login");
            return;
        }

        try {
            KakaoUserInfo kakaoUserInfo = kakaoService.getUserInfo(code);
            System.out.println("✅ 유저 정보: " + kakaoUserInfo);

            String kakaoId = kakaoUserInfo.getId();

            // ✅ 세션에 kakaoId 저장
            session.setAttribute("kakaoId", kakaoId);

            //저장직후 로그찍기
            System.out.println("✔ 세션에 저장된 kakaoId: " + session.getAttribute("kakaoId"));

            // ✅ 이미 가입된 회원인지 확인
            if (memberService.existsByKakaoId(kakaoId)) {
                Member member = memberService.findByKakaoId(kakaoId);
                session.setAttribute("loginUser", member); // 로그인 세션 저장
                System.out.println("✅ 이미 가입된 카카오 사용자입니다. 메인 페이지로 이동합니다.");
                System.out.println("✅ 로그인 세션 저장: " + member.getNickname() + ", " + member.getRole());
                response.sendRedirect("http://localhost:3000/");  // 이미 가입자면 메인으로
            } else {
                System.out.println("🆕 신규 카카오 사용자입니다. 별명 입력 페이지로 이동합니다.");
                response.sendRedirect("http://localhost:3000/nickname");  // 신규면 닉네임 입력
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login");


        }
    }


    //별명저장 API + 세션에 로그인 상태 집어넣기
    @PostMapping("/save-nickname")
    public ResponseEntity<String> saveNickname(@RequestBody Map<String, String> requestBody, HttpSession session) {
        String nickname = requestBody.get("nickname");
        String kakaoId = (String) session.getAttribute("kakaoId");

        if (kakaoId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다.");
        }

        try {
            // 회원가입 후 Member 객체 반환하는 서비스 메서드 호출 (아래 메서드가 Member 반환해야 합니다)
            Member newMember = memberService.joinWithKakaoReturnMember(kakaoId, nickname);

            // 세션에 로그인 정보 저장
            session.setAttribute("loginUser", newMember);
            System.out.println("✅ 새 회원가입 후 로그인 세션 저장: " + newMember.getNickname() + ", " + newMember.getRole());

            return ResponseEntity.ok("카카오 회원가입 성공!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //내kakaoid 조회
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(HttpSession session) {
        String kakaoId = (String) session.getAttribute("kakaoId");
        Member loginUser = (Member) session.getAttribute("loginUser");
        
        System.out.println("🔍 세션에서 가져온 kakaoId = " + kakaoId);
        System.out.println("🔍 세션에서 가져온 loginUser = " + loginUser);
        
        Member member = null;
        
        // 먼저 loginUser 세션이 있는지 확인
        if (loginUser != null) {
            System.out.println("✅ loginUser 세션이 있음");
            member = loginUser;
        } else if (kakaoId != null) {
            // loginUser 세션이 없으면 kakaoId로 조회
            member = memberService.findByKakaoId(kakaoId);
            System.out.println("✅ kakaoId로 Member 조회 성공");
            // 조회한 Member를 세션에 저장
            session.setAttribute("loginUser", member);
        } else {
            System.out.println("❌ 모든 세션 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보 없음");
        }
        
        // 순환 참조 방지를 위해 단순한 Map 반환
        Map<String, Object> response = new HashMap<>();
        response.put("id", member.getId());
        response.put("nickname", member.getNickname());
        response.put("username", member.getUsername());
        response.put("email", member.getEmail());
        response.put("role", member.getRole().toString());
        response.put("loginType", member.getLoginType().toString());
        response.put("createdAt", member.getCreatedAt());
        
        System.out.println("✅ 반환할 데이터: nickname=" + member.getNickname() + ", role=" + member.getRole());
        
        return ResponseEntity.ok(response);
    }




}
