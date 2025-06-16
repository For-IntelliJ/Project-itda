package com.itda.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

// 게시판 글 작성 요청 DTO
@Setter
@Getter
public class BoardWriteRequestDto {
    private String type;    // 게시판 종류 (질문/자유)
    private String title;   // 글 제목
    private String content;
    private List<String> tags;// 글 내용

}