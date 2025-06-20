package com.itda.backend.dto;

public class KakaoUserInfo {
    private String nickname;
    private String email;

    public KakaoUserInfo(String nickname, String email) {
        this.nickname = nickname;
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public String getEmail() {
        return email;
    }
}
