package com.itda.backend.controller;

import com.itda.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<String> getAllTags() {
        return tagService.getAllTagNames(); // 또는 TagDto 리스트
    }
}
