package com.itda.backend.service;

import com.itda.backend.dto.KakaoUserInfo;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class KakaoService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String REST_API_KEY = "a680d77f4256f7e8110b6bfb85250623";
    private final String REDIRECT_URI = "http://localhost:8080/auth/kakao/callback";

    public KakaoUserInfo getUserInfo(String code) {
        String accessToken = getAccessToken(code);

        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

        Map<String, Object> body = response.getBody();
        if (body != null) {
            Long id = ((Number) body.get("id")).longValue();  // ✅ 카카오 ID 가져오기
            Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            String nickname = (String) profile.get("nickname");

            return new KakaoUserInfo(id, nickname);  // ✅ id 추가
        } else {
            throw new RuntimeException("카카오 사용자 정보 조회 실패");
        }
    }

    private String getAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", REST_API_KEY);
        params.add("redirect_uri", REDIRECT_URI);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        Map<String, Object> body = response.getBody();

        if (body != null && body.get("access_token") != null) {
            return (String) body.get("access_token");
        } else {
            throw new RuntimeException("카카오 액세스 토큰 발급 실패");
        }
    }
}
