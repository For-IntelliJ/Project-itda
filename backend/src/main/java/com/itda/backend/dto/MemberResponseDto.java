package com.itda.backend.dto;

import com.itda.backend.domain.enums.Role;

// 회원 정보를 클라이언트에 응답할 때 사용하는 DTO
public class MemberResponseDto {
    private Long id;          // 회원 고유 ID
    private String email;     // 이메일
    private String username;  // 이름
    private String nickname;  // 닉네임
    private String phone;     // 연락처
    private Role role;        // 역할 (멘토/멘티)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}