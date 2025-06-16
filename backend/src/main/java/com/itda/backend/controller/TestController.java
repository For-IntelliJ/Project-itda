package com.itda.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String testConnection() {
        return "백엔드 연결 성공!! 🎉";
    }
}

