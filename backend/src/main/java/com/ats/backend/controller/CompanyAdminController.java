package com.ats.backend.controller;

import com.ats.backend.dto.ApiResponse;
import com.ats.backend.dto.CreateRecruiterRequest;
import com.ats.backend.dto.UserDto;
import com.ats.backend.service.CompanyAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company-admin")
@Tag(name = "Company Admin Controller", description = "Endpoints for Company Admins to manage recruiters")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'ADMIN')")
public class CompanyAdminController {

    private final CompanyAdminService companyAdminService;

    public CompanyAdminController(CompanyAdminService companyAdminService) {
        this.companyAdminService = companyAdminService;
    }

    @PostMapping("/recruiters")
    @Operation(summary = "Create Recruiter", description = "Company Admin creates a new Recruiter for their company.")
    public ResponseEntity<ApiResponse<UserDto>> createRecruiter(
            @Valid @RequestBody CreateRecruiterRequest request,
            Authentication authentication) {
        UserDto created = companyAdminService.createRecruiter(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Recruiter created successfully", created));
    }

    @GetMapping("/recruiters")
    @Operation(summary = "Get Recruiters (Paginated)", description = "Fetches a paginated list of recruiters belonging to the Company Admin's company.")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getRecruiters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            Authentication authentication) {
        
        int validPage = Math.max(0, page);
        int validSize = Math.max(1, Math.min(size, 100));

        java.util.Set<String> allowedSorts = java.util.Set.of("createdAt", "fullName", "username", "email", "id");
        String cleanSortBy = allowedSorts.contains(sortBy) ? sortBy : "createdAt";

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(cleanSortBy).ascending() : Sort.by(cleanSortBy).descending();
        Pageable pageable = PageRequest.of(validPage, validSize, sort);

        Page<UserDto> recruiters = companyAdminService.getRecruitersPaginated(authentication.getName(), search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Recruiters retrieved successfully", recruiters));
    }

    @PatchMapping("/recruiters/{userId}/status")
    @Operation(summary = "Toggle Recruiter Status", description = "Enables or disables a recruiter within the company.")
    public ResponseEntity<ApiResponse<UserDto>> toggleRecruiterStatus(
            @PathVariable Long userId,
            @RequestParam boolean enabled,
            Authentication authentication) {
        UserDto updated = companyAdminService.toggleRecruiterStatus(authentication.getName(), userId, enabled);
        return ResponseEntity.ok(ApiResponse.success("Recruiter status updated successfully", updated));
    }
}
