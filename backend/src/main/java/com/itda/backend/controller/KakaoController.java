package com.itda.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

import com.itda.backend.dto.KakaoUserInfo;
import com.itda.backend.service.KakaoService;
import com.itda.backend.service.MemberService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itda.backend.domain.Member;




// 이하 코드...

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
                System.out.println("✅ 이미 가입된 카카오 사용자입니다. 메인 페이지로 이동합니다.");
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


    // 별명 저장 API
    @PostMapping("/save-nickname")
    public ResponseEntity<String> saveNickname(@RequestBody Map<String, String> requestBody, HttpSession session) {
        String nickname = requestBody.get("nickname");
        String kakaoId = (String) session.getAttribute("kakaoId");

        if (kakaoId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다.");
        }

        try {
            memberService.joinWithKakao(kakaoId, nickname);
            return ResponseEntity.ok("카카오 회원가입 성공!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //내정보조회
    @GetMapping("/me")
    public ResponseEntity<String> getMyInfo(HttpSession session) {
        String kakaoId = (String) session.getAttribute("kakaoId");
        System.out.println("🔍 세션에서 가져온 kakaoId = " + kakaoId);
        System.out.println("📥 /me에서 꺼낸 kakaoId: " + kakaoId);
        if (kakaoId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보 없음");
        }

        Member member = memberService.findByKakaoId(kakaoId);
        return ResponseEntity.ok(member.getNickname()); // ✅ 문자열 그대로
    }



}
