package com.itda.backend.dto;

import com.itda.backend.domain.enums.ClassLevel;
import com.itda.backend.domain.enums.OnOffType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassResponseDto {
    private Long id;
    private String title;
    private String curriculum;
    private ClassLevel level;
    private OnOffType onoff;
    private String mainImage;
    private String detailContent;
    private LocalDateTime createdAt;
    
    // 연관 엔티티 정보를 단순한 필드로 표현
    private Long mentorId;
    private String mentorName;
    private String mentorUsername;
    
    private Long categoryId;
    private String categoryName;
    
    private Long regionId;
    private String regionName;
}
