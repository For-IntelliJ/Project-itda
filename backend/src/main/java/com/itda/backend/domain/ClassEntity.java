package com.itda.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ❗ 꼭 필요한 경우에만 setter 작성 (예: mentor를 나중에 지정해야 할 때)
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Member mentor;

    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;
    
    // ID 직접 접근을 위한 getter 메소드들
    public Long getMentorId() {
        return mentor != null ? mentor.getId() : null;
    }
    
    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }
    
    public Long getRegionId() {
        return region != null ? region.getId() : null;
    }
    
    // 멘토 프로필 정보 getter (필요시 사용)
    public String getMentorIntro() {
        // mentoInfo 필드를 우선 사용하고, 없으면 MentorProfile에서 가져오기
        if (mentoInfo != null && !mentoInfo.trim().isEmpty()) {
            return mentoInfo;
        }
        try {
            return mentor != null && mentor.getMentorProfile() != null ? 
                   mentor.getMentorProfile().getIntro() : null;
        } catch (Exception e) {
            return null; // Lazy Loading 실패시 null 반환
        }
    }
    
    public String getMentorCareer() {
        try {
            return mentor != null && mentor.getMentorProfile() != null ? 
                   mentor.getMentorProfile().getCareer() : null;
        } catch (Exception e) {
            return null; // Lazy Loading 실패시 null 반환
        }
    }

    private String curriculum;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ClassLevel level = ClassLevel.초급;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OnOffType onoff = OnOffType.오프라인;

    @Setter
    private String mainImage;
    
    private String detailContent;
    
    // 멘토 소개 정보
    @Column(columnDefinition = "TEXT")
    private String mentoInfo;
    
    // 공간/위치 정보  
    @Column(columnDefinition = "TEXT")
    private String spaceInfo;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
