package com.itda.backend.domain;

import com.itda.backend.domain.enums.BoardType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = true)
    private Member writer;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BoardType type = BoardType.FREE;

    private String title;

    private String content;

    private int hits;

    private LocalDateTime createdAt;

    // 태그 연결 정보 추가
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardTag> boardTags = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 편의 메서드 (선택 사항)
    public void addBoardTag(BoardTag boardTag) {
        this.boardTags.add(boardTag);
        boardTag.setBoard(this);
    }

    public void removeBoardTag(BoardTag boardTag) {
        this.boardTags.remove(boardTag);
        boardTag.setBoard(null);
    }
}
