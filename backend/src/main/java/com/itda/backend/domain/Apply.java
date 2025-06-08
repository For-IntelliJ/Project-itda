package com.itda.backend.domain;

import com.itda.backend.domain.enums.MentorStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "apply")
public class Apply {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentee_id", nullable = false)
    private Member mentee;
    @Enumerated(EnumType.STRING)
    private MentorStatus status = MentorStatus.PENDING;
    private LocalDateTime appliedAt;
    @PrePersist
    public void prePersist() { this.appliedAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ClassEntity getClazz() { return clazz; }
    public void setClazz(ClassEntity clazz) { this.clazz = clazz; }
    public Member getMentee() { return mentee; }
    public void setMentee(Member mentee) { this.mentee = mentee; }
    public MentorStatus getStatus() { return status; }
    public void setStatus(MentorStatus status) { this.status = status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
