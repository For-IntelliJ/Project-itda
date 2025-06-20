package com.itda.backend.service;

import com.itda.backend.domain.Tag;
import com.itda.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public List<String> getAllTagNames() {
        return tagRepository.findAll()
                .stream()
                .map(Tag::getName) // Tag 엔티티에 name 필드가 있다고 가정
                .collect(Collectors.toList());
    }
}

