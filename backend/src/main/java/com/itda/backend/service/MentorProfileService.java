package com.itda.backend.service;

import com.itda.backend.domain.MentorProfile;
import com.itda.backend.repository.MentorProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class MentorProfileService {

    private final MentorProfileRepository mentorProfileRepository;

    public MentorProfileService(MentorProfileRepository mentorProfileRepository) {
        this.mentorProfileRepository = mentorProfileRepository;
    }

    public MentorProfile findByUserId(Long userId) {
        return mentorProfileRepository.findByUserId(userId);
    }

    public java.util.List<MentorProfile> findAll() {
        return mentorProfileRepository.findAll();
    }

    public boolean existsByUserId(Long userId) {
        return mentorProfileRepository.existsByUserId(userId);
    }
}
