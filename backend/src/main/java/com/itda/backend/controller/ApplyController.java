package com.itda.backend.controller;

import com.itda.backend.domain.enums.ApplyStatus;
import com.itda.backend.dto.ApplyRequestDto;
import com.itda.backend.dto.ApplyResponseDto;
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

    /**
     * 클래스 신청
     */
    @PostMapping
    public ResponseEntity<?> applyToClass(@RequestBody ApplyRequestDto requestDto) {
        try {
            System.out.println(">> [APPLY] 클래스 신청 요청: " + requestDto.getClassId() + ", 날짜: " + requestDto.getSelectedDate());
            
            ApplyResponseDto response = applyService.applyToClass(requestDto);
            
            System.out.println(">> [APPLY] 신청 완료: ID = " + response.getId());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "클래스 신청이 완료되었습니다.");
            result.put("apply", response);

            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.out.println(">> [APPLY ERROR] 신청 실패: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 멘티별 신청 내역 조회
     */
    @GetMapping("/mentee/{menteeId}")
    public ResponseEntity<List<ApplyResponseDto>> getAppliesByMentee(@PathVariable Long menteeId) {
        try {
            List<ApplyResponseDto> applies = applyService.getAppliesByMentee(menteeId);
            return ResponseEntity.ok(applies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    /**
     * 클래스별 신청 내역 조회
     */
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<ApplyResponseDto>> getAppliesByClass(@PathVariable Long classId) {
        try {
            List<ApplyResponseDto> applies = applyService.getAppliesByClass(classId);
            return ResponseEntity.ok(applies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    /**
     * 신청 상태 변경 (멘토가 승인/거절)
     */
    @PutMapping("/{applyId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long applyId,
            @RequestBody Map<String, String> request) {
        try {
            ApplyStatus status = ApplyStatus.valueOf(request.get("status").toUpperCase());
            ApplyResponseDto response = applyService.updateApplyStatus(applyId, status);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "상태가 업데이트되었습니다.",
                    "apply", response
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 테스트용 - 현재 멘티 ID 10의 신청 내역 조회
     */
    @GetMapping("/my-applies")
    public ResponseEntity<List<ApplyResponseDto>> getMyApplies() {
        try {
            // 임시로 멘티 ID 10 사용
            List<ApplyResponseDto> applies = applyService.getAppliesByMentee(10L);
            return ResponseEntity.ok(applies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }
}