package com.itda.backend.mapper;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Category;
import com.itda.backend.domain.Region;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.ClassCreateRequestDto;
import com.itda.backend.dto.ClassResponseDto;

public class ClassMapper {

    public static ClassEntity toEntity(ClassCreateRequestDto dto,
                                       Category category,
                                       Region region,
                                       Member mentor) {
        return ClassEntity.builder()
                .title(dto.getTitle())
                .category(category)
                .region(region)
                .mentor(mentor)
                .curriculum(dto.getCurriculum())
                .level(dto.getLevel())
                .onoff(dto.getOnoff())
                .mainImage(dto.getMainImage())
                .detailContent(dto.getDetailContent())
                .build();
    }

    public static ClassResponseDto toDto(ClassEntity entity) {
        return ClassResponseDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .curriculum(entity.getCurriculum())
                .level(entity.getLevel())
                .onoff(entity.getOnoff())
                .mainImage(entity.getMainImage())
                .detailContent(entity.getDetailContent())
                .createdAt(entity.getCreatedAt())
                // 멘토 정보
                .mentorId(entity.getMentor() != null ? entity.getMentor().getId() : null)
                .mentorName(entity.getMentor() != null ? entity.getMentor().getUsername() : null)
                .mentorUsername(entity.getMentor() != null ? entity.getMentor().getUsername() : null)
                // 카테고리 정보
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                // 지역 정보
                .regionId(entity.getRegion() != null ? entity.getRegion().getId() : null)
                .regionName(entity.getRegion() != null ? entity.getRegion().getName() : null)
                .build();
    }
}
