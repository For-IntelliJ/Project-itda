package com.itda.backend.domain.enums;

public enum MentorStatus {
    PENDING("대기"),
    APPROVED("승인"),
    REJECTED("거절");

    private final String description;

    MentorStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
