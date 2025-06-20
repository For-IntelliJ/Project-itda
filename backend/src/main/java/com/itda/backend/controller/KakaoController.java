package com.itda.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.itda.backend.dto.KakaoUserInfo;
import com.itda.backend.service.KakaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// 이하 코드...

@RestController
@RequestMapping("/auth/kakao")
public class KakaoController {

    private final KakaoService kakaoService;

    public KakaoController(KakaoService kakaoService) {
        this.kakaoService = kakaoService;
    }

    //카카오 콜백 인증코드 받음
    @GetMapping("/callback")
    public void kakaoCallback(@RequestParam(required = false) String code, HttpServletResponse response) throws IOException {
        System.out.println("🔑 카카오 인증 코드: " + code);

        if (code == null || code.isEmpty()) {
            System.out.println("❌ 인증 코드 없음! 로그인 실패 처리");
            response.sendRedirect("http://localhost:3000/login"); // 로그인 페이지로 되돌리기
            return;
        }

        try {
            KakaoUserInfo kakaoUserInfo = kakaoService.getUserInfo(code);
            System.out.println("✅ 유저 정보: " + kakaoUserInfo);

            // TODO: 세션에 저장하거나 JWT 발급 등

            response.sendRedirect("http://localhost:3000/nickname");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login");
        }
    }




    // 별명 저장 API
    @PostMapping("/save-nickname")
    public ResponseEntity<String> saveNickname(@RequestBody Map<String, String> requestBody) {
        String nickname = requestBody.get("nickname");

        // TODO: 현재 로그인한 사용자 정보와 연결해서 DB에 별명 저장 (임시 예시)
        System.out.println("저장할 별명: " + nickname);

        return ResponseEntity.ok("별명 저장 성공");
    }
}
