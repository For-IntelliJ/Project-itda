package com.itda.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequestDto {
    private String currentPassword;
    private String newPassword;
}
