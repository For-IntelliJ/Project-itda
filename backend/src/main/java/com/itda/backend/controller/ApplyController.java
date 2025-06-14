package com.itda.backend.controller;

import com.itda.backend.domain.Apply;
import com.itda.backend.domain.enums.MentorStatus;
import com.itda.backend.service.ApplyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/applies")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplyController {

    private final ApplyService applyService;

    public ApplyController(ApplyService applyService) {
        this.applyService = applyService;
    }

    // ✅ 클래스 신청
    @PostMapping
    public ResponseEntity<?> applyToClass(@RequestBody Map<String, Object> request) {
        try {
            Long classId = Long.parseLong(request.get("classId").toString());
            Long menteeId = 3L; // 테스트용 멘티 ID (TODO: 인증된 사용자로 대체)

            Apply apply = applyService.applyToClass(classId, menteeId);

            Map<String, Object> result = new HashMap<>();
            result.put("applyId", apply.getId());
            result.put("classId", apply.getClassEntity().getId());
            result.put("className", apply.getClassEntity().getClassname());
            result.put("menteeId", apply.getMentee().getId());
            result.put("menteeName", apply.getMentee().getUsername());
            result.put("status", apply.getStatus().getDescription());
            result.put("appliedAt", apply.getAppliedAt());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ 멘티 기준 신청 목록 조회
    @GetMapping("/mentee/{menteeId}")
    public ResponseEntity<List<Apply>> getAppliesByMentee(@PathVariable Long menteeId) {
        return ResponseEntity.ok(applyService.getAppliesByMentee(menteeId));
    }

    // ✅ 클래스 기준 신청 목록 조회
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Apply>> getAppliesByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(applyService.getAppliesByClass(classId));
    }

    // ✅ 신청 상태 변경
    @PutMapping("/{applyId}/status")
    public ResponseEntity<Apply> updateStatus(
            @PathVariable Long applyId,
            @RequestBody Map<String, String> request) {
        try {
            MentorStatus status = MentorStatus.valueOf(request.get("status"));
            return ResponseEntity.ok(applyService.updateApplyStatus(applyId, status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
