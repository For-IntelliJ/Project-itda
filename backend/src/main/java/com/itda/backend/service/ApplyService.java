package com.itda.backend.service;

import com.itda.backend.domain.Apply;
import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.ApplyStatus;
import com.itda.backend.dto.ApplyRequestDto;
import com.itda.backend.dto.ApplyResponseDto;
import com.itda.backend.repository.ApplyRepository;
import com.itda.backend.repository.ClassRepository;
import com.itda.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplyService {

    private final ApplyRepository applyRepository;
    private final ClassRepository classRepository;
    private final MemberRepository memberRepository;

    public ApplyService(ApplyRepository applyRepository,
                        ClassRepository classRepository,
                        MemberRepository memberRepository) {
        this.applyRepository = applyRepository;
        this.classRepository = classRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public ApplyResponseDto applyToClass(ApplyRequestDto requestDto) {
        // 클래스 존재 확인
        ClassEntity classEntity = classRepository.findById(requestDto.getClassId())
                .orElseThrow(() -> new RuntimeException("클래스를 찾을 수 없습니다."));

        // 멘티 존재 확인 (임시로 ID 10 사용, 나중에 세션에서 가져올 예정)
        Long menteeId = requestDto.getMenteeId() != null ? requestDto.getMenteeId() : 10L;
        Member mentee = memberRepository.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 중복 신청 확인
        if (applyRepository.existsByMenteeIdAndClassEntityId(menteeId, requestDto.getClassId())) {
            throw new RuntimeException("이미 신청한 클래스입니다.");
        }

        // Apply 엔티티 생성 및 저장
        Apply apply = Apply.builder()
                .classEntity(classEntity)
                .mentee(mentee)
                .selectedDate(requestDto.getSelectedDate())
                .status(ApplyStatus.PENDING)
                .build();

        Apply savedApply = applyRepository.save(apply);

        // DTO로 변환하여 반환
        return convertToResponseDto(savedApply);
    }

    public List<ApplyResponseDto> getAppliesByMentee(Long menteeId) {
        return applyRepository.findByMenteeId(menteeId)
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ApplyResponseDto> getAppliesByClass(Long classId) {
        return applyRepository.findByClassEntityId(classId)
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplyResponseDto updateApplyStatus(Long applyId, ApplyStatus status) {
        Apply apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));
        
        // 상태 업데이트
        apply.setStatus(status);
        Apply savedApply = applyRepository.save(apply);
        
        return convertToResponseDto(savedApply);
    }

    private ApplyResponseDto convertToResponseDto(Apply apply) {
        return ApplyResponseDto.builder()
                .id(apply.getId())
                .classId(apply.getClassId())
                .className(apply.getClassEntity() != null ? apply.getClassEntity().getTitle() : "클래스명 없음")
                .menteeId(apply.getMenteeId())
                .menteeName(apply.getMentee() != null ? apply.getMentee().getUsername() : "멘티명 없음")
                .status(apply.getStatus())
                .selectedDate(apply.getSelectedDate())
                .appliedAt(apply.getAppliedAt())
                .build();
    }
}