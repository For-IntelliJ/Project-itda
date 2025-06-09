package com.itda.backend;

import com.itda.backend.domain.Member;
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
        member.setGender(dto.getGender());
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
