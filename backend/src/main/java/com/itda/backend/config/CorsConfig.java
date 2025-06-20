package com.itda.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 요청에 대해
                .allowedOrigins("http://localhost:3000") // 프론트엔드 주소
                .allowedOriginPatterns("*") // 개발 환경을 위한 패턴 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 명시적으로 작성
                .allowedHeaders("*") // 요청 헤더 허용
                .allowCredentials(true) // 쿠키(세션) 허용
                .maxAge(3600); // preflight 결과 캐시 시간 (초)
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 파일에 대한 정적 리소스 핸들러
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
                
        // 이미지 파일에 대한 핸들러 (uploads/classes/ 폴더용)
        registry.addResourceHandler("/img/**")
                .addResourceLocations("file:uploads/classes/");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // 구체적인 프론트엔드 주소
        configuration.addAllowedOriginPattern("*"); // 개발 환경을 위한 패턴
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
