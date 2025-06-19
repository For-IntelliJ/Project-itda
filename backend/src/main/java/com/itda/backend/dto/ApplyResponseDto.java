package com.itda.backend.dto;

import com.itda.backend.domain.enums.ApplyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyResponseDto {
    private Long id;
    private Long classId;
    private String className;
    private Long menteeId;
    private String menteeName;
    private ApplyStatus status;
    private String selectedDate;
    private LocalDateTime appliedAt;
}