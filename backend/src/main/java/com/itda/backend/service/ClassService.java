package com.itda.backend.service;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Category;
import com.itda.backend.domain.Region;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.ClassCreateRequestDto;
import com.itda.backend.dto.ClassResponseDto;
import com.itda.backend.repository.ClassRepository;
import com.itda.backend.repository.CategoryRepository;
import com.itda.backend.repository.RegionRepository;
import com.itda.backend.repository.MemberRepository;
import com.itda.backend.mapper.ClassMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@Service
public class ClassService {

    private final ClassRepository classRepository;
    private final CategoryRepository categoryRepository;
    private final RegionRepository regionRepository;
    private final MemberRepository memberRepository;
    
    // 금지된 이미지 URL 패턴들 (Firebase URL 제외)
    private final List<String> FORBIDDEN_IMAGE_PATTERNS = Arrays.asList(
        "via.placeholder",
        "placeholder.com",
        "기본+이미지",
        "%EA%B8%B0%EB%B3%B8",
        "lorem",
        "dummy"
    );
    
    // 허용된 이미지 도메인들
    private final List<String> ALLOWED_IMAGE_DOMAINS = Arrays.asList(
        "firebasestorage.googleapis.com",
        "googleapis.com",
        "storage.googleapis.com",
        "localhost:8080",
        "amazonaws.com",
        "cloudfront.net",
        "imgur.com",
        "unsplash.com"
    );

    public ClassService(ClassRepository classRepository,
                        CategoryRepository categoryRepository,
                        RegionRepository regionRepository,
                        MemberRepository memberRepository) {
        this.classRepository = classRepository;
        this.categoryRepository = categoryRepository;
        this.regionRepository = regionRepository;
        this.memberRepository = memberRepository;
    }

    public ClassEntity save(ClassCreateRequestDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        Region region = regionRepository.findById(dto.getRegionId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지역입니다."));
        Member mentor = memberRepository.findById(1L) // ⚠️ 추후 세션 사용자로 교체
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 멘토입니다."));

        ClassEntity classEntity = ClassMapper.toEntity(dto, mentor, category, region);
        return classRepository.save(classEntity);
    }

    public List<ClassEntity> findAll() {
        return classRepository.findAll();
    }
    
    public long count() {
        return classRepository.count();
    }

    /**
     * 안전한 이미지 URL 처리 - Firebase URL 허용
     */
    private String getSafeImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return null;
        }
        
        String trimmedUrl = imageUrl.trim();
        
        // 1. 완전한 HTTP/HTTPS URL인지 확인
        if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
            
            // 2. 허용된 도메인인지 확인
            boolean isAllowedDomain = ALLOWED_IMAGE_DOMAINS.stream()
                .anyMatch(domain -> trimmedUrl.contains(domain));
            
            if (isAllowedDomain) {
                return trimmedUrl;
            }
            
            // 3. 금지된 패턴 확인 (허용된 도메인이 아닌 경우만)
            String lowerUrl = trimmedUrl.toLowerCase();
            for (String pattern : FORBIDDEN_IMAGE_PATTERNS) {
                if (lowerUrl.contains(pattern)) {
                    return null;
                }
            }
            
            // 4. 단순한 placeholder 형태 확인 (300x200 같은 단순 패턴만)
            if (trimmedUrl.matches(".*\\b\\d{1,4}x\\d{1,4}\\b.*") && 
                !trimmedUrl.contains("firebasestorage") && 
                !trimmedUrl.contains("amazonaws") &&
                trimmedUrl.length() < 50) { // 짧은 URL만 placeholder로 간주
                return null;
            }
            
            // 5. 기타 유효한 외부 URL
            return trimmedUrl;
        }
        
        // 6. 상대 경로나 로컬 파일
        if (trimmedUrl.startsWith("/")) {
            return trimmedUrl;
        }
        
        // 7. 파일명만 있는 경우
        return trimmedUrl;
    }

    /**
     * 모든 클래스를 관계 데이터와 함께 DTO로 변환
     */
    public List<ClassResponseDto> findAllAsDto() {
        try {
            // 관계 데이터를 포함한 조회
            List<ClassEntity> entities;
            try {
                entities = classRepository.findAllWithRelations();
            } catch (Exception e) {
                return new ArrayList<>();
            }
            
            if (entities.isEmpty()) {
                return new ArrayList<>();
            }
            
            // 각 엔티티를 DTO로 변환
            List<ClassResponseDto> result = new ArrayList<>();
            
            for (ClassEntity entity : entities) {
                try {
                    ClassResponseDto dto = createDetailedDto(entity);
                    result.add(dto);
                } catch (Exception e) {
                    // 에러가 발생해도 계속 진행
                }
            }
            
            return result;
            
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    /**
     * 상세한 관계 데이터를 포함한 DTO 생성
     */
    private ClassResponseDto createDetailedDto(ClassEntity entity) {
        try {
            // 이미지 URL 안전 처리
            String safeImageUrl = getSafeImageUrl(entity.getMainImage());
            
            // 멘토 정보 추출
            String mentorName = extractMentorName(entity);
            Long mentorId = extractMentorId(entity);
            
            // 카테고리 정보 추출
            String categoryName = extractCategoryName(entity);
            Long categoryId = extractCategoryId(entity);
            
            // 지역 정보 추출
            String regionName = extractRegionName(entity);
            Long regionId = extractRegionId(entity);
            
            return ClassResponseDto.builder()
                    .id(entity.getId())
                    .title(entity.getTitle() != null ? entity.getTitle() : "제목 없음")
                    .curriculum(entity.getCurriculum())
                    .level(entity.getLevel())
                    .onoff(entity.getOnoff())
                    .mainImage(safeImageUrl)
                    .detailContent(entity.getDetailContent())
                    .createdAt(entity.getCreatedAt())
                    // 멘토 정보
                    .mentorId(mentorId)
                    .mentorName(mentorName)
                    .mentorUsername(mentorName)
                    // 카테고리 정보
                    .categoryId(categoryId)
                    .categoryName(categoryName)
                    // 지역 정보
                    .regionId(regionId)
                    .regionName(regionName)
                    .build();
                    
        } catch (Exception e) {
            throw e;
        }
    }
    
    /**
     * 멘토 이름 추출 (member.username 또는 member.nickname 사용)
     */
    private String extractMentorName(ClassEntity entity) {
        try {
            if (entity.getMentor() == null) {
                return "멘토 정보 없음";
            }
            
            Member mentor = entity.getMentor();
            
            // username을 우선으로 하고, 없으면 nickname 사용
            String name = mentor.getUsername();
            if (name == null || name.trim().isEmpty()) {
                name = mentor.getNickname();
            }
            
            return name != null && !name.trim().isEmpty() ? name : "멘토 정보 없음";
            
        } catch (Exception e) {
            return "멘토 정보 없음";
        }
    }
    
    /**
     * 멘토 ID 추출
     */
    private Long extractMentorId(ClassEntity entity) {
        try {
            return entity.getMentor() != null ? entity.getMentor().getId() : null;
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * 카테고리 이름 추출
     */
    private String extractCategoryName(ClassEntity entity) {
        try {
            if (entity.getCategory() == null) {
                return "미분류";
            }
            
            String name = entity.getCategory().getName();
            return name != null && !name.trim().isEmpty() ? name : "미분류";
            
        } catch (Exception e) {
            return "미분류";
        }
    }
    
    /**
     * 카테고리 ID 추출
     */
    private Long extractCategoryId(ClassEntity entity) {
        try {
            return entity.getCategory() != null ? entity.getCategory().getId() : null;
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * 지역 이름 추출
     */
    private String extractRegionName(ClassEntity entity) {
        try {
            if (entity.getRegion() == null) {
                return "지역 정보 없음";
            }
            
            String name = entity.getRegion().getName();
            return name != null && !name.trim().isEmpty() ? name : "지역 정보 없음";
            
        } catch (Exception e) {
            return "지역 정보 없음";
        }
    }
    
    /**
     * 지역 ID 추출
     */
    private Long extractRegionId(ClassEntity entity) {
        try {
            return entity.getRegion() != null ? entity.getRegion().getId() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * ID로 클래스 조회 (관계 데이터 포함)
     */
    public ClassEntity findById(Long id) {
        return classRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 클래스를 찾을 수 없습니다. id=" + id));
    }
}