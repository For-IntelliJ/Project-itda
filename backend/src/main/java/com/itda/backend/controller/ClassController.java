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

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final String uploadDir = "uploads/";

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
            if (detailImage != null && !detailImage.isEmpty()) {
                // 예시에서는 detailImage도 mainImage로 저장하던 것 수정
                // 필요시 dto.setDetailImage(detailImagePath); 생성해서 추가하세요
            }

            classService.save(dto);

            return ResponseEntity.ok("클래스 및 이미지 업로드 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("클래스 생성 실패: " + e.getMessage());
        }
    }

    /**
     * 모든 클래스 조회
     */
    @GetMapping
    public ResponseEntity<List<ClassResponseDto>> getAllClasses() {
        try {
            System.out.println(">> [DEBUG] 클래스 목록 요청 시작");
            
            List<ClassResponseDto> classes = classService.findAllAsDto();
            System.out.println(">> [DEBUG] 찾은 클래스 개수: " + classes.size());
            
            // 각 클래스의 정보 체크
            for (ClassResponseDto cls : classes) {
                System.out.println(">> [DEBUG] 클래스 ID: " + cls.getId() + ", 이름: " + cls.getTitle());
                System.out.println("  - 멘토: " + cls.getMentorName());
                System.out.println("  - 카테고리: " + cls.getCategoryName());
                System.out.println("  - 지역: " + cls.getRegionName());
            }
            
            System.out.println(">> [DEBUG] DTO 반환 준비 완료");
            
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            System.out.println(">> [ERROR] 클래스 목록 조회 중 오류 발생:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ID로 클래스 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClassEntity> getClassById(@PathVariable Long id) {
        try {
            ClassEntity classEntity = classService.findById(id);
            return ResponseEntity.ok(classEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
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
