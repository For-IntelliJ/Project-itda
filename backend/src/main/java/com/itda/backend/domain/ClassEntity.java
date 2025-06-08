package com.itda.backend.domain;

import com.itda.backend.domain.enums.ClassLevel;
import com.itda.backend.domain.enums.OnOffType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "class")
public class ClassEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Member mentor;
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;
    private String curriculum;
    @Enumerated(EnumType.STRING)
    private ClassLevel level = ClassLevel.초급;
    @Enumerated(EnumType.STRING)
    private OnOffType onoff = OnOffType.온라인;
    private String mainImage;
    private String detailContent;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }
    // Getter/Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Member getMentor() { return mentor; }
    public void setMentor(Member mentor) { this.mentor = mentor; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public String getCurriculum() { return curriculum; }
    public void setCurriculum(String curriculum) { this.curriculum = curriculum; }
    public ClassLevel getLevel() { return level; }
    public void setLevel(ClassLevel level) { this.level = level; }
    public OnOffType getOnoff() { return onoff; }
    public void setOnoff(OnOffType onoff) { this.onoff = onoff; }
    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }
    public String getDetailContent() { return detailContent; }
    public void setDetailContent(String detailContent) { this.detailContent = detailContent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
