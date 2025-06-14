package com.itda.backend.service;

import com.itda.backend.domain.ClassEntity;
import com.itda.backend.domain.Category;
import com.itda.backend.domain.Region;
import com.itda.backend.domain.Member;
import com.itda.backend.dto.ClassCreateRequestDto;
import com.itda.backend.repository.ClassRepository;
import com.itda.backend.repository.CategoryRepository;
import com.itda.backend.repository.RegionRepository;
import com.itda.backend.repository.MemberRepository;
import com.itda.backend.mapper.ClassMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    private final ClassRepository classRepository;
    private final CategoryRepository categoryRepository;
    private final RegionRepository regionRepository;
    private final MemberRepository memberRepository;

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

        ClassEntity classEntity = ClassMapper.toEntity(dto, category, region, mentor);
        return classRepository.save(classEntity);
    }

    public List<ClassEntity> findAll() {
        return classRepository.findAll();
    }

    public ClassEntity findById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 클래스를 찾을 수 없습니다. id=" + id));
    }
}
