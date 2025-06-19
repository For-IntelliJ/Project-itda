package com.itda.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable()) // CORS는 CorsConfig에서 처리
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // 모든 API 엔드포인트 허용
                        .requestMatchers("/error").permitAll()  // 에러 페이지 허용
                        .requestMatchers("/uploads/**").permitAll() // 업로드 파일 허용
                        .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                        .maximumSessions(1) // 세션 최대 1개
                );

        return http.build();
    }
}