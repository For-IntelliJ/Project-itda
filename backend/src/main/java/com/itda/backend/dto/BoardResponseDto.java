package com.itda.backend.dto;

import com.itda.backend.domain.Board;

import java.time.format.DateTimeFormatter;

public record BoardResponseDto(
        Long id,
        String title,
        String content,
        String writer,
        String date,
        int views
) {
    public static BoardResponseDto from(Board board) {
        return new BoardResponseDto(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getWriter().getNickname(),
                board.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                board.getHits()
        );
    }
}
