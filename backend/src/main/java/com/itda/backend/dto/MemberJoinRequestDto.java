package com.itda.backend.dto;

// 회원가입 시 클라이언트에서 전달되는 요청 데이터 객체
public class MemberJoinRequestDto {
    private String email;     // 이메일 주소
    private String password;  // 비밀번호
    private String username;  // 이름
    private String nickname;  // 별명
    private String phone;     // 연락처
    private String gender;    // 성별
    private String role; // "MENTEE" or "MENTOR"


    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
