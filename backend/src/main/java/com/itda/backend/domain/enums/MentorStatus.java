package com.itda.backend.domain.enums;

public enum MentorStatus {
    PENDING("대기"),
    APPROVED("승인"),
    REJECTED("거절"),
    approved("승인"), // 데이터베이스 호환성을 위한 소문자 버전
    pending("대기"),
    rejected("거절");

    private final String description;

    MentorStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
