package com.itda.backend.dto;

// 쪽지 전송 요청 DTO
public class MessageRequestDto {
    private Long receiverId;  // 받는 사람 ID
    private String content;   // 쪽지 내용

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
