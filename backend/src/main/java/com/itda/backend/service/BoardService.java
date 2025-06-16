package com.itda.backend.service;

import com.itda.backend.domain.*;
import com.itda.backend.domain.enums.BoardType;
import com.itda.backend.dto.BoardWriteRequestDto;
import com.itda.backend.repository.BoardRepository;
import com.itda.backend.repository.TagRepository;
import com.itda.backend.repository.BoardTagRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class BoardService extends GenericService<Board> {
    private final BoardRepository boardRepository;
    private final TagRepository tagRepository;
    private final BoardTagRepository boardTagRepository;

    public BoardService(
            BoardRepository boardRepository,
            TagRepository tagRepository,
            BoardTagRepository boardTagRepository
    ) {
        super(boardRepository);
        this.boardRepository = boardRepository;
        this.tagRepository = tagRepository;
        this.boardTagRepository = boardTagRepository;
    }

    public Optional<Board> findOptionalById(Long id) {
        return boardRepository.findById(id);
    }


    public List<Board> getBoardsByType(BoardType type) {
        return boardRepository.findByTypeOrderByCreatedAtDesc(type);
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

        // 태그 처리
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            for (String tagName : dto.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));

                BoardTag boardTag = BoardTag.builder()
                        .board(board)
                        .tag(tag)
                        .id(new BoardTagId(null, tag.getId())) // id는 persist 후 자동 할당됨
                        .build();

                board.addBoardTag(boardTag);
            }
        }

        boardRepository.save(board);
        log.info("✅ 게시글 저장 완료 (제목: {}, 작성자 ID: {})", board.getTitle(), writer.getId());
    }
}
