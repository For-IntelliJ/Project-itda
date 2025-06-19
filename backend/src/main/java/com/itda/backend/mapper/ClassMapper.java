package com.itda.backend.mapper;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Category;
import com.itda.backend.domain.Region;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.ClassCreateRequestDto;
import com.itda.backend.dto.ClassResponseDto;

public class ClassMapper {

    public static ClassEntity toEntity(ClassCreateRequestDto dto, Member mentor, Category category, Region region) {
        return ClassEntity.builder()
                .mentor(mentor)
                .title(dto.getTitle())
                .category(category)
                .region(region)
                .curriculum(dto.getCurriculum())
                .level(dto.getLevel())
                .onoff(dto.getOnoff())
                .mainImage(dto.getMainImage())
                .detailContent(dto.getDetailContent())
                .mentoInfo(dto.getMentoInfo())
                .spaceInfo(dto.getSpaceInfo())
                .build();
    }

    public static ClassResponseDto toDto(ClassEntity entity) {
        try {
            return ClassResponseDto.builder()
                    .id(entity.getId())
                    .title(entity.getTitle())
                    .curriculum(entity.getCurriculum())
                    .level(entity.getLevel())
                    .onoff(entity.getOnoff())
                    .mainImage(entity.getMainImage())
                    .detailContent(entity.getDetailContent())
                    .createdAt(entity.getCreatedAt())
                    // 멘토 정보 - 안전한 처리
                    .mentorId(entity.getMentor() != null ? entity.getMentor().getId() : null)
                    .mentorName(entity.getMentor() != null ? entity.getMentor().getUsername() : "Unknown")
                    .mentorUsername(entity.getMentor() != null ? entity.getMentor().getUsername() : "Unknown")
                    // 카테고리 정보 - 안전한 처리
                    .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                    .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : "Unknown")
                    // 지역 정보 - 안전한 처리
                    .regionId(entity.getRegion() != null ? entity.getRegion().getId() : null)
                    .regionName(entity.getRegion() != null ? entity.getRegion().getName() : "Unknown")
                    .build();
        } catch (Exception e) {
            System.out.println(">> [ERROR] ClassMapper.toDto 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("클래스 DTO 변환 실패: " + e.getMessage(), e);
        }
    }
}
