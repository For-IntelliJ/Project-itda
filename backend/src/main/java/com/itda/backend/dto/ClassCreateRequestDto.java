package com.itda.backend.dto;

// 클래스 개설 요청 시 전달되는 정보
public class ClassCreateRequestDto {
    private String title;           // 클래스 제목
    private Long categoryId;       // 카테고리 ID
    private Long regionId;         // 지역 ID
    private String curriculum;     // 커리큘럼 요약
    private String level;          // 수준 (초급/중급/고급)
    private String onoff;          // 온/오프라인 여부
    private String mainImage;      // 대표 이미지 경로
    private String detailContent;  // 상세 설명


    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
    public String getCurriculum() { return curriculum; }
    public void setCurriculum(String curriculum) { this.curriculum = curriculum; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getOnoff() { return onoff; }
    public void setOnoff(String onoff) { this.onoff = onoff; }
    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }
    public String getDetailContent() { return detailContent; }
    public void setDetailContent(String detailContent) { this.detailContent = detailContent; }
}
