package com.itda.backend.service;

import com.itda.backend.domain.Board;
import com.itda.backend.repository.BoardRepository;
import org.springframework.stereotype.Service;

@Service
public class BoardService extends GenericService<Board> {
    public BoardService(BoardRepository repository) {
        super(repository);
    }
}
