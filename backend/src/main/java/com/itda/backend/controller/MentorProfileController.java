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
     * 사용자 ID로 멘토 프로필 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<MentorProfile> getMentorProfileByUserId(@PathVariable Long userId) {
        try {
            MentorProfile mentorProfile = mentorProfileService.findByUserId(userId);
            if (mentorProfile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(mentorProfile);
        } catch (Exception e) {
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
