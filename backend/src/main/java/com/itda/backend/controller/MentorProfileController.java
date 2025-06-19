package com.itda.backend.controller;

import com.itda.backend.domain.MentorProfile;
import com.itda.backend.service.MentorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentor-profiles")
@RequiredArgsConstructor
public class MentorProfileController {

    private final MentorProfileService mentorProfileService;

    /**
     * 테스트: 모든 멘토 프로필 조회
     */
    @GetMapping("/test/all")
    public ResponseEntity<?> getAllMentorProfiles() {
        try {
            System.out.println(">> [DEBUG] 모든 멘토 프로필 조회 요청");
            
            var profiles = mentorProfileService.findAll();
            System.out.println(">> [DEBUG] 찾은 프로필 개수: " + profiles.size());
            
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            System.out.println(">> [ERROR] 모든 멘토 프로필 조회 중 오류:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    /**
     * 사용자 ID로 멘토 프로필 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<MentorProfile> getMentorProfileByUserId(@PathVariable Long userId) {
        try {
            System.out.println(">> [DEBUG] 멘토 프로필 조회 요청: userId = " + userId);
            
            MentorProfile mentorProfile = mentorProfileService.findByUserId(userId);
            
            if (mentorProfile == null) {
                System.out.println(">> [DEBUG] 멘토 프로필을 찾을 수 없음: userId = " + userId);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println(">> [DEBUG] 찾은 멘토 프로필:");
            System.out.println("  - ID: " + mentorProfile.getId());
            System.out.println("  - User ID: " + (mentorProfile.getUser() != null ? mentorProfile.getUser().getId() : "null"));
            System.out.println("  - Career: " + mentorProfile.getCareer());
            System.out.println("  - Intro: " + (mentorProfile.getIntro() != null ? mentorProfile.getIntro().substring(0, Math.min(100, mentorProfile.getIntro().length())) + "..." : "null"));
            System.out.println("  - Status: " + mentorProfile.getStatus());
            
            return ResponseEntity.ok(mentorProfile);
        } catch (Exception e) {
            System.out.println(">> [ERROR] 멘토 프로필 조회 중 오류:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 사용자가 멘토 프로필을 가지고 있는지 확인
     */
    @GetMapping("/exists/user/{userId}")
    public ResponseEntity<Boolean> checkMentorProfileExists(@PathVariable Long userId) {
        try {
            boolean exists = mentorProfileService.existsByUserId(userId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
