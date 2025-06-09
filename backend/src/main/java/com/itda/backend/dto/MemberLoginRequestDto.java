package com.itda.backend.dto;

// 로그인 요청 시 이메일과 비밀번호를 담는 객체
public class MemberLoginRequestDto {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}