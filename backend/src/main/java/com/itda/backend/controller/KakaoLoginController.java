package com.itda.backend.controller;

import com.itda.backend.domain.Member;
import com.itda.backend.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class KakaoLoginController {

    private final MemberService memberService;

    public KakaoLoginController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body, HttpSession session) {
        String accessToken = body.get("accessToken");
        if (accessToken == null) {
            return ResponseEntity.badRequest().body("accessToken 없음");
        }

        // Kakao 사용자 정보 요청
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> request = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                request,
                Map.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("카카오 사용자 정보 가져오기 실패");
        }

        Map<String, Object> kakaoInfo = response.getBody();
        String kakaoId = String.valueOf(kakaoInfo.get("id"));

        Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoInfo.get("kakao_account");
        String email = (String) kakaoAccount.get("email");
        String nickname = (String) ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname");

        // 디버깅 로그
        System.out.println(">> 이메일: " + email);
        System.out.println(">> kakaoId: " + kakaoId);
        System.out.println(">> nickname: " + nickname);

        // DB 조회 or 자동 회원가입
        try {
            Member member = memberService.findOrCreateByKakaoId(kakaoId, email, nickname);
            session.setAttribute("loginMember", member);
            return ResponseEntity.ok("카카오 로그인 완료");

        } catch (Exception e) {
            System.out.println("❌ DB 저장 중 오류 발생");
            e.printStackTrace(); // 콘솔에 전체 에러 메시지 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러: " + e.getMessage());
        }

    }
}
