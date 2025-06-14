package com.itda.backend.repository;

import com.itda.backend.domain.Apply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {
    List<Apply> findByMenteeId(Long menteeId);

    List<Apply> findByClassEntityId(Long classId);

    boolean existsByMenteeIdAndClassEntityId(Long menteeId, Long classId);

    Optional<Apply> findByMenteeIdAndClassEntityId(Long menteeId, Long classId);
}
