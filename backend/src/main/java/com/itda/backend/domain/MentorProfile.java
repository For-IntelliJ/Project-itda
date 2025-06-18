package com.itda.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itda.backend.domain.enums.MentorStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_profile")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MentorProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Member user;
    private String career;
    private String intro;
    @Enumerated(EnumType.STRING)
    private MentorStatus status = MentorStatus.PENDING;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Member getUser() { return user; }
    public void setUser(Member user) { this.user = user; }
    public String getCareer() { return career; }
    public void setCareer(String career) { this.career = career; }
    public String getIntro() { return intro; }
    public void setIntro(String intro) { this.intro = intro; }
    public MentorStatus getStatus() { return status; }
    public void setStatus(MentorStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
