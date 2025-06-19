package com.itda.backend.controller;

import com.itda.backend.domain.Board;
import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.BoardType;
import com.itda.backend.dto.BoardResponseDto;
import com.itda.backend.dto.BoardWriteRequestDto;
import com.itda.backend.service.BoardService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    // ✅ 세션 확인용 GET 핸들러 추가
    @GetMapping("/write")
    public ResponseEntity<?> goWritePage(HttpSession session) {
        Object sessionUser = session.getAttribute("loginUser");

        if (!(sessionUser instanceof Member)) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        return ResponseEntity.ok("작성 페이지 접근 성공");
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDto> getPostById(@PathVariable Long id) {
        return boardService.findOptionalById(id)
                .map(BoardResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<List<BoardResponseDto>> getBoardsByType(@RequestParam("type") String typeStr) {
        try {
            BoardType type = BoardType.valueOf(typeStr.trim().toUpperCase());
            List<Board> boards = boardService.getBoardsByType(type);
            List<BoardResponseDto> dtos = boards.stream()
                    .map(BoardResponseDto::from)
                    .collect(Collectors.toList());// Java 16+ or collect(Collectors.toList())

            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @PostMapping("/write")
    public ResponseEntity<?> writePost(@RequestBody BoardWriteRequestDto dto, HttpSession session) {
        Object sessionUser = session.getAttribute("loginUser");
        if (!(sessionUser instanceof Member)) {
            return ResponseEntity.status(401).body("로그인이 필요합니다. 세션 정보 없음 또는 잘못된 타입");
        }

        Member loginUser = (Member) sessionUser;
        boardService.savePost(dto, loginUser);
        return ResponseEntity.ok("게시글이 등록되었습니다.");
    }
}
