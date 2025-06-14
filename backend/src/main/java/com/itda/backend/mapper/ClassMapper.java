package com.itda.backend.mapper;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Category;
import com.itda.backend.domain.Region;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.ClassCreateRequestDto;

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
}
