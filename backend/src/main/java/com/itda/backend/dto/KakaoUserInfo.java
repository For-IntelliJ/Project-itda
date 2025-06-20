package com.itda.backend.dto;

public class KakaoUserInfo {
    private String id;
    private String nickname;

    public KakaoUserInfo(String id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }

    public String getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }
}
