package com.itda.backend.service;

import com.itda.backend.domain.Category;
import com.itda.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService extends GenericService<Category> {
    public CategoryService(CategoryRepository repository) {
        super(repository);
    }

    public List<Category> findAll() {
        return repository.findAll();
    }

    public Category findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다. id=" + id));
    }
}
