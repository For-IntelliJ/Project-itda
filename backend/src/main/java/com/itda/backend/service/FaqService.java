package com.itda.backend.service;

import com.itda.backend.domain.Faq;
import com.itda.backend.repository.FaqRepository;
import org.springframework.stereotype.Service;

@Service
public class FaqService extends GenericService<Faq> {
    public FaqService(FaqRepository repository) {
        super(repository);
    }
}
