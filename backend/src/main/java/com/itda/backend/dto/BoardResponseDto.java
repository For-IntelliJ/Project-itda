package com.itda.backend.dto;

import com.itda.backend.domain.Board;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public record BoardResponseDto(
        Long id,
        String title,
        String content,
        String writer,
        String date,
        int views,
        List<String> tags
) {
    public static BoardResponseDto from(Board board) {
        return new BoardResponseDto(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getWriter().getNickname(),
                board.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                board.getHits(),
                board.getBoardTags().stream()
                        .map(boardTag -> boardTag.getTag().getName())
                        .collect(Collectors.toList())
        );
    }
}
