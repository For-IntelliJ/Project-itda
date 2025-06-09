package com.itda.backend;

import com.itda.backend.domain.Member;
import com.itda.backend.domain.enums.Gender;
import com.itda.backend.domain.enums.LoginType;
import com.itda.backend.dto.MemberJoinRequestDto;
import com.itda.backend.dto.MemberResponseDto;

public class MemberMapper {

    // 회원가입 요청 DTO → Member Entity 변환
    public static Member toEntity(MemberJoinRequestDto dto) {
        Member member = new Member();
        member.setEmail(dto.getEmail());
        member.setPassword(dto.getPassword());
        member.setUsername(dto.getUsername());
        member.setNickname(dto.getNickname());
        member.setPhone(dto.getPhone());

        // 안전한 gender 변환 처리
        String genderStr = dto.getGender();
        if ("남자".equals(genderStr)) {
            member.setGender(Gender.M);
        } else if ("여자".equals(genderStr)) {
            member.setGender(Gender.F);
        } else {
            throw new IllegalArgumentException("올바르지 않은 성별 값입니다: " + genderStr);
        }

        // loginType은 LOCAL로 고정(소문자 안돼!!)
        member.setLoginType(LoginType.LOCAL);
        System.out.println("[DEBUG] 로그인 타입 설정: " + member.getLoginType());
        System.out.println("[DEBUG] 로그인 타입 name(): " + member.getLoginType().name());

        return member;
    }

    // Member Entity → 응답 DTO 변환
    public static MemberResponseDto toDto(Member member) {
        MemberResponseDto dto = new MemberResponseDto();
        dto.setId(member.getId());
        dto.setEmail(member.getEmail());
        dto.setUsername(member.getUsername());
        dto.setNickname(member.getNickname());
        dto.setPhone(member.getPhone());
        dto.setRole(member.getRole());
        return dto;
    }
}