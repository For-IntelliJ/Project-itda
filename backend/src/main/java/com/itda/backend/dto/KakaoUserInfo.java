package com.itda.backend.dto;

public class KakaoUserInfo {
    private Long id;
    private String nickname;

    public KakaoUserInfo(Long id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }

    public Long getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }
}
