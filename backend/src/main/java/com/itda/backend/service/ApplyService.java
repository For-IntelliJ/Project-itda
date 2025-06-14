package com.itda.backend.service;

import com.itda.backend.domain.Apply;
import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.MentorStatus;
import com.itda.backend.repository.ApplyRepository;
import com.itda.backend.repository.ClassRepository;
import com.itda.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public Apply applyToClass(Long classId, Long menteeId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("클래스를 찾을 수 없습니다."));

        Member mentee = memberRepository.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (applyRepository.existsByMenteeIdAndClassEntityId(menteeId, classId)) {
            throw new RuntimeException("이미 신청한 클래스입니다.");
        }

        Apply apply = new Apply();
        apply.setClassEntity(classEntity);
        apply.setMentee(mentee);
        apply.setStatus(MentorStatus.PENDING); // 기본 상태
        // appliedAt은 @PrePersist로 자동 설정됨

        return applyRepository.save(apply);
    }

    public List<Apply> getAppliesByMentee(Long menteeId) {
        return applyRepository.findByMenteeId(menteeId);
    }

    public List<Apply> getAppliesByClass(Long classId) {
        return applyRepository.findByClassEntityId(classId);
    }

    @Transactional
    public Apply updateApplyStatus(Long applyId, MentorStatus status) {
        Apply apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));
        apply.setStatus(status);
        return applyRepository.save(apply);
    }
}
