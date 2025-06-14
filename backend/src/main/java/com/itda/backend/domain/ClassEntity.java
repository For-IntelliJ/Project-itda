package com.itda.backend.domain;

import com.itda.backend.domain.enums.ClassLevel;
import com.itda.backend.domain.enums.OnOffType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "class")
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ❗ 꼭 필요한 경우에만 setter 작성 (예: mentor를 나중에 지정해야 할 때)
    @Setter
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

    @Setter
    private String mainImage;
    private String detailContent;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void setCategory(Category category) {
    }

    public void setRegion(Region region) {

    }
}
