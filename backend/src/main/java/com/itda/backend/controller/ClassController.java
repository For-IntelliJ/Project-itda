package com.itda.backend.controller;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.dto.ClassCreateRequestDto;
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
    public List<ClassEntity> getAllClasses() {
        return classService.findAll();
    }

    /**
     * ID로 클래스 조회
     */
    @GetMapping("/{id}")
    public ClassEntity getClassById(@PathVariable Long id) {
        return classService.findById(id);
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
