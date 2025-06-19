package com.itda.backend.domain;

import com.itda.backend.domain.enums.ApplyStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "apply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // class_id FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    // mentee_id FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentee_id", nullable = false)
    private Member mentee;

    // 신청 상태 (대기/승인/거절)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplyStatus status = ApplyStatus.PENDING;

    // 신청 시간
    private LocalDateTime appliedAt;

    // 신청한 날짜 (클래스 수강 희망 날짜)
    private String selectedDate;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
    }

    // 편의 메서드들
    public Long getClassId() {
        return classEntity != null ? classEntity.getId() : null;
    }
    
    public Long getMenteeId() {
        return mentee != null ? mentee.getId() : null;
    }
}