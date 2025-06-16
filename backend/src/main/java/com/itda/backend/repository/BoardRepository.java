package com.itda.backend.repository;

import com.itda.backend.domain.Board;
import com.itda.backend.domain.enums.BoardType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByType(BoardType type);
}
