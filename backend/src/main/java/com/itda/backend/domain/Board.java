package com.itda.backend.domain;

import com.itda.backend.domain.enums.BoardType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "board")
public class Board {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private Member writer;
    @Enumerated(EnumType.STRING)
    private BoardType type = BoardType.FREE;
    private String title;
    private String content;
    private int hits;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Member getWriter() { return writer; }
    public void setWriter(Member writer) { this.writer = writer; }
    public BoardType getType() { return type; }
    public void setType(BoardType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getHits() { return hits; }
    public void setHits(int hits) { this.hits = hits; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}