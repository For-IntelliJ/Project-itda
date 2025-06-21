package com.itda.backend.config;

import com.itda.backend.interceptor.LoginCheckInterceptor;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    // 🔹 CORS 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해
                .allowedOrigins("http://localhost:3000")  // 프론트 주소만 허용
                .allowedHeaders("*")
                .allowCredentials(true)  // 쿠키 (세션) 허용
                .maxAge(3600);  // preflight 캐시 (1시간)
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
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> cookieProcessorCustomizer() {
        return factory -> factory.addContextCustomizers(context -> {
            Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
            cookieProcessor.setSameSiteCookies("Lax");
            context.setCookieProcessor(cookieProcessor);
        });
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns("/api/members/me", "/api/members/change-password", "/api/members/logout")
                .excludePathPatterns("/api/members/login", "/api/members/join");
    }
}
