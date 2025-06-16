package com.itda.backend.repository;

import com.itda.backend.domain.BoardTag;
import com.itda.backend.domain.BoardTagId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardTagRepository extends JpaRepository<BoardTag, BoardTagId> {
    // 필요하다면 커스텀 쿼리 메서드 추가 가능
}
