package com.itda.backend.dto;

// 게시판 글 작성 요청 DTO
public class BoardWriteRequestDto {
    private String type;    // 게시판 종류 (질문/자유)
    private String title;   // 글 제목
    private String content; // 글 내용

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}