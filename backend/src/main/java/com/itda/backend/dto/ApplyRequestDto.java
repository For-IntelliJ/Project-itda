package com.itda.backend.dto;

// 클래스 신청 요청 DTO
public class ApplyRequestDto {
    private Long classId;  // 신청할 클래스 ID

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
}
