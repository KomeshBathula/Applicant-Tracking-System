package com.ats.backend.service;

import com.ats.backend.dto.CreateRecruiterRequest;
import com.ats.backend.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyAdminService {
    UserDto createRecruiter(String companyAdminUsername, CreateRecruiterRequest request);
    Page<UserDto> getRecruitersPaginated(String companyAdminUsername, String search, Pageable pageable);
    UserDto toggleRecruiterStatus(String companyAdminUsername, Long recruiterUserId, boolean enabled);
}
