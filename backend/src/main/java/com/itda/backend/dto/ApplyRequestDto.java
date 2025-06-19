package com.itda.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyRequestDto {
    private Long classId;
    private String selectedDate;
    private Long menteeId; // 임시로 받지만, 실제로는 세션에서 가져올 예정
}