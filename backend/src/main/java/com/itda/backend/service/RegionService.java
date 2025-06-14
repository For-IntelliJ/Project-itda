package com.itda.backend.service;

import com.itda.backend.domain.Region;
import com.itda.backend.repository.RegionRepository;
import org.springframework.stereotype.Service;

@Service
public class RegionService extends GenericService<Region> {
    public RegionService(RegionRepository repository) {
        super(repository);
    }
}
