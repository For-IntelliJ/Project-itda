package com.itda.backend.service;

import com.itda.backend.domain.Board;
import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.BoardType;
import com.itda.backend.dto.BoardWriteRequestDto;
import com.itda.backend.repository.BoardRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class BoardService extends GenericService<Optional<Board>> {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        super(boardRepository);
        this.boardRepository = boardRepository;
    }

    public Optional<Board> findById(Long id) {
        return boardRepository.findById(id);
    }

    public List<Board> getBoardsByType(BoardType type) {
        return boardRepository.findByType(type);
    }

    public void savePost(BoardWriteRequestDto dto, Member writer) {
        log.info("📥 받은 게시글 DTO - type: {}, title: {}, content: {}", dto.getType(), dto.getTitle(), dto.getContent());

        BoardType type;
        try {
            type = BoardType.valueOf(dto.getType().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 게시판 타입입니다: " + dto.getType());
        }

        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setWriter(writer);
        board.setType(type);

        boardRepository.save(board);
        log.info("✅ 게시글 저장 완료 (제목: {}, 작성자 ID: {})", board.getTitle(), writer.getId());
    }
}
