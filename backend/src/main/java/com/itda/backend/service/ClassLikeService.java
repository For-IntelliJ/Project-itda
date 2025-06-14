package com.itda.backend.service;

import com.itda.backend.domain.ClassLike;
import com.itda.backend.repository.ClassLikeRepository;
import org.springframework.stereotype.Service;

@Service
public class ClassLikeService extends GenericService<ClassLike> {
    public ClassLikeService(ClassLikeRepository repository) {
        super(repository);
    }
}
