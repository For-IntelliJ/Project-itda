package com.itda.backend.dto;

// 댓글 작성 요청 DTO
public class CommentWriteRequestDto {
    private Long boardId;      // 댓글이 달리는 게시글 ID
    private String content;    // 댓글 내용

    public Long getBoardId() { return boardId; }
    public void setBoardId(Long boardId) { this.boardId = boardId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}