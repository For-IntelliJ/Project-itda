package com.itda.backend.controller;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.dto.ClassCreateRequestDto;
import com.itda.backend.dto.ClassResponseDto;
import com.itda.backend.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final String uploadDir = "uploads/";

    @PostConstruct
    public void init() {
        System.out.println(">> [INFO] ClassController 초기화 완료");
    }

    /**
     * 일반 클래스 생성 (텍스트 데이터만)
     */
    @PostMapping
    public ResponseEntity<?> createClass(@RequestBody ClassCreateRequestDto dto) {
        try {
            classService.save(dto);
            return ResponseEntity.ok("클래스 생성 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("클래스 생성 실패: " + e.getMessage());
        }
    }

    /**
     * 클래스 생성 + 이미지 업로드 (멀티파트)
     */
    @PostMapping(value = "/with-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createClassWithFiles(
            @RequestPart("classData") ClassCreateRequestDto dto,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "detailImage", required = false) MultipartFile detailImage) {

        try {
            // 이미지 저장
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainImagePath = saveFile(mainImage);
                dto.setMainImage(mainImagePath);
            }

            classService.save(dto);
            return ResponseEntity.ok("클래스 및 이미지 업로드 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("클래스 생성 실패: " + e.getMessage());
        }
    }

    /**
     * 간단한 테스트 엔드포인트
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("ClassController 정상 작동 중!");
    }

    /**
     * 모든 클래스 조회
     */
    @GetMapping
    public ResponseEntity<?> getAllClasses() {
        try {
            long totalCount = classService.count();
            
            if (totalCount == 0) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            // DTO 서비스 사용
            List<ClassResponseDto> dtoList = classService.findAllAsDto();
            
            // 프론트엔드용 최종 형태로 변환
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (ClassResponseDto dto : dtoList) {
                try {
                    Map<String, Object> classData = new HashMap<>();
                    
                    // 기본 정보
                    classData.put("id", dto.getId());
                    classData.put("title", dto.getTitle() != null ? dto.getTitle() : "제목 없음");
                    classData.put("curriculum", dto.getCurriculum() != null ? dto.getCurriculum() : "");
                    classData.put("level", dto.getLevel() != null ? dto.getLevel().toString() : "초급");
                    classData.put("onoff", dto.getOnoff() != null ? dto.getOnoff().toString() : "오프라인");
                    classData.put("mainImage", dto.getMainImage()); // null일 수 있음 (프론트엔드에서 처리)
                    classData.put("detailContent", dto.getDetailContent() != null ? dto.getDetailContent() : "");
                    classData.put("createdAt", dto.getCreatedAt() != null ? dto.getCreatedAt().toString() : "");
                    
                    // 멘토 정보 (여러 필드명으로 제공)
                    String mentorName = dto.getMentorName() != null ? dto.getMentorName() : "멘토 정보 없음";
                    classData.put("mentorName", mentorName);
                    classData.put("mentorUsername", mentorName);
                    classData.put("mentor_name", mentorName); // 프론트엔드 호환용
                    classData.put("mentorId", dto.getMentorId());
                    
                    // 카테고리 정보 (여러 필드명으로 제공)
                    String categoryName = dto.getCategoryName() != null ? dto.getCategoryName() : "미분류";
                    classData.put("categoryName", categoryName);
                    classData.put("category_name", categoryName); // 프론트엔드 호환용
                    classData.put("categoryId", dto.getCategoryId());
                    
                    // 지역 정보
                    String regionName = dto.getRegionName() != null ? dto.getRegionName() : "지역 정보 없음";
                    classData.put("regionName", regionName);
                    classData.put("region_name", regionName);
                    classData.put("regionId", dto.getRegionId());
                    
                    // 추가 필드 (프론트엔드 호환성)
                    classData.put("people", 0); // 기본값
                    
                    result.add(classData);
                    
                } catch (Exception e) {
                    // 에러가 발생해도 계속 진행
                }
            }
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            // 에러 발생 시에도 빈 배열 반환하여 프론트엔드가 동작하도록 함
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * ID로 클래스 상세 조회 - 모든 관계 데이터 포함
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getClassById(@PathVariable Long id) {
        try {
            System.out.println(">> [DEBUG] 클래스 상세 정보 요청: ID = " + id);
            
            ClassEntity classEntity = classService.findById(id);
            
            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            
            // 기본 정보
            response.put("id", classEntity.getId());
            response.put("title", classEntity.getTitle());
            response.put("curriculum", classEntity.getCurriculum());
            response.put("level", classEntity.getLevel() != null ? classEntity.getLevel().toString() : "초급");
            response.put("onoff", classEntity.getOnoff() != null ? classEntity.getOnoff().toString() : "오프라인");
            response.put("mainImage", classEntity.getMainImage());
            response.put("detailContent", classEntity.getDetailContent());
            response.put("createdAt", classEntity.getCreatedAt() != null ? classEntity.getCreatedAt().toString() : "");
            
            // 멘토 정보 (여러 필드명으로 제공)
            if (classEntity.getMentor() != null) {
                Map<String, Object> mentorData = new HashMap<>();
                mentorData.put("id", classEntity.getMentor().getId());
                mentorData.put("username", classEntity.getMentor().getUsername());
                mentorData.put("nickname", classEntity.getMentor().getNickname());
                mentorData.put("email", classEntity.getMentor().getEmail());
                
                response.put("mentor", mentorData);
                response.put("mentorName", classEntity.getMentor().getUsername());
                response.put("mentorUsername", classEntity.getMentor().getUsername());
                response.put("mentor_name", classEntity.getMentor().getUsername());
            } else {
                response.put("mentor", null);
                response.put("mentorName", "멘토 정보 없음");
                response.put("mentorUsername", "멘토 정보 없음");
                response.put("mentor_name", "멘토 정보 없음");
            }
            
            // 멘토 소개 정보
            response.put("mentoInfo", classEntity.getMentoInfo());
            
            // 카테고리 정보
            if (classEntity.getCategory() != null) {
                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("id", classEntity.getCategory().getId());
                categoryData.put("name", classEntity.getCategory().getName());
                
                response.put("category", categoryData);
                response.put("categoryName", classEntity.getCategory().getName());
                response.put("category_name", classEntity.getCategory().getName());
            } else {
                response.put("category", null);
                response.put("categoryName", "미분류");
                response.put("category_name", "미분류");
            }
            
            // 지역 정보
            if (classEntity.getRegion() != null) {
                Map<String, Object> regionData = new HashMap<>();
                regionData.put("id", classEntity.getRegion().getId());
                regionData.put("name", classEntity.getRegion().getName());
                
                response.put("region", regionData);
                response.put("regionName", classEntity.getRegion().getName());
                response.put("region_name", classEntity.getRegion().getName());
            } else {
                response.put("region", null);
                response.put("regionName", "지역 정보 없음");
                response.put("region_name", "지역 정보 없음");
            }
            
            // 공간 정보
            response.put("spaceInfo", classEntity.getSpaceInfo());
            
            // 추가 필드 (프론트엔드 호환성)
            response.put("people", 0); // 기본값
            response.put("classname", classEntity.getTitle()); // 일부 프론트엔드에서 사용
            
            System.out.println(">> [DEBUG] 응답 데이터 생성 완료");
            System.out.println("  - 멘토: " + response.get("mentorName"));
            System.out.println("  - 카테고리: " + response.get("categoryName"));
            System.out.println("  - 지역: " + response.get("regionName"));
            System.out.println("  - 멘토소개: " + (classEntity.getMentoInfo() != null ? "있음 (" + classEntity.getMentoInfo().length() + "글자)" : "없음"));
            System.out.println("  - 공간소개: " + (classEntity.getSpaceInfo() != null ? "있음 (" + classEntity.getSpaceInfo().length() + "글자)" : "없음"));
            System.out.println("  - 커리큘럼: " + (classEntity.getCurriculum() != null ? "있음 (" + classEntity.getCurriculum().length() + "글자)" : "없음"));
            System.out.println("  - 상세내용: " + (classEntity.getDetailContent() != null ? "있음 (" + classEntity.getDetailContent().length() + "글자)" : "없음"));
            
            // 상세 데이터 확인
            if (classEntity.getMentoInfo() != null && classEntity.getMentoInfo().length() > 0) {
                System.out.println("  - 멘토소개 내용: " + classEntity.getMentoInfo().substring(0, Math.min(100, classEntity.getMentoInfo().length())) + "...");
            }
            if (classEntity.getSpaceInfo() != null && classEntity.getSpaceInfo().length() > 0) {
                System.out.println("  - 공간소개 내용: " + classEntity.getSpaceInfo().substring(0, Math.min(100, classEntity.getSpaceInfo().length())) + "...");
            }
            if (classEntity.getCurriculum() != null && classEntity.getCurriculum().length() > 0) {
                System.out.println("  - 커리큘럼 내용: " + classEntity.getCurriculum().substring(0, Math.min(100, classEntity.getCurriculum().length())) + "...");
            }
            if (classEntity.getDetailContent() != null && classEntity.getDetailContent().length() > 0) {
                System.out.println("  - 상세내용 내용: " + classEntity.getDetailContent().substring(0, Math.min(100, classEntity.getDetailContent().length())) + "...");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println(">> [ERROR] 클래스 상세 조회 중 오류:");
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 관계 데이터 강제 리프레시 (디버깅용)
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshRelationData() {
        try {
            long totalClasses = classService.count();
            List<ClassResponseDto> dtos = classService.findAllAsDto();
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalClasses", totalClasses);
            result.put("convertedDTOs", dtos.size());
            result.put("success", true);
            result.put("message", "관계 데이터 리프레시 완료");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 데이터베이스 상태 확인용 디버그 엔드포인트
     */
    @GetMapping("/debug")
    public ResponseEntity<?> debugDatabaseState() {
        try {
            System.out.println(">> [DEBUG] 데이터베이스 상태 확인 시작");
            
            long totalClasses = classService.count();
            System.out.println("총 클래스 수: " + totalClasses);
            
            if (totalClasses > 0) {
                // 첫 번째 클래스의 상세 정보 확인
                List<ClassEntity> allClasses = classService.findAll();
                if (!allClasses.isEmpty()) {
                    ClassEntity firstClass = allClasses.get(0);
                    System.out.println("첫 번째 클래스 정보:");
                    System.out.println("  - ID: " + firstClass.getId());
                    System.out.println("  - 제목: " + firstClass.getTitle());
                    System.out.println("  - 멘토: " + (firstClass.getMentor() != null ? firstClass.getMentor().getUsername() : "NULL"));
                    System.out.println("  - 카테고리: " + (firstClass.getCategory() != null ? firstClass.getCategory().getName() : "NULL"));
                    System.out.println("  - 지역: " + (firstClass.getRegion() != null ? firstClass.getRegion().getName() : "NULL"));
                    System.out.println("  - 멘토소개: " + (firstClass.getMentoInfo() != null ? "있음 (" + firstClass.getMentoInfo().length() + "글자)" : "없음"));
                    System.out.println("  - 공간소개: " + (firstClass.getSpaceInfo() != null ? "있음 (" + firstClass.getSpaceInfo().length() + "글자)" : "없음"));
                    System.out.println("  - 커리큘럼: " + (firstClass.getCurriculum() != null ? "있음 (" + firstClass.getCurriculum().length() + "글자)" : "없음"));
                    System.out.println("  - 상세내용: " + (firstClass.getDetailContent() != null ? "있음 (" + firstClass.getDetailContent().length() + "글자)" : "없음"));
                    
                    // 실제 내용 미리보기
                    if (firstClass.getMentoInfo() != null && firstClass.getMentoInfo().length() > 0) {
                        System.out.println("  - 멘토소개 미리보기: " + firstClass.getMentoInfo().substring(0, Math.min(50, firstClass.getMentoInfo().length())));
                    }
                    if (firstClass.getSpaceInfo() != null && firstClass.getSpaceInfo().length() > 0) {
                        System.out.println("  - 공간소개 미리보기: " + firstClass.getSpaceInfo().substring(0, Math.min(50, firstClass.getSpaceInfo().length())));
                    }
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalClasses", totalClasses);
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            response.put("message", "디버그 정보가 콘솔에 출력되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println(">> [ERROR] 디버그 중 오류:");
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 파일 저장 메서드
     */
    private String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return fileName;
    }
}