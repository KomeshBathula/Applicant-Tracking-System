package com.ats.backend.service.impl;

import com.ats.backend.dto.CreateRecruiterRequest;
import com.ats.backend.dto.UserDto;
import com.ats.backend.entity.Company;
import com.ats.backend.entity.Role;
import com.ats.backend.entity.RoleName;
import com.ats.backend.entity.User;
import org.springframework.security.access.AccessDeniedException;
import com.ats.backend.exception.ConflictException;
import com.ats.backend.exception.EmailAlreadyExistsException;
import com.ats.backend.exception.ResourceNotFoundException;
import com.ats.backend.mapper.UserMapper;
import com.ats.backend.repository.RoleRepository;
import com.ats.backend.repository.UserRepository;
import com.ats.backend.service.CompanyAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class CompanyAdminServiceImpl implements CompanyAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public CompanyAdminServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    private User getCompanyAdminUser(String usernameOrEmail) {
        String identifier = usernameOrEmail != null ? usernameOrEmail.trim() : "";
        String cleanUsername = identifier.toLowerCase(Locale.ROOT);
        User admin = userRepository.findByEmailOrUsername(identifier, cleanUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));

        if (admin.getCompany() == null) {
            throw new AccessDeniedException("User is not assigned to any company.");
        }
        return admin;
    }

    @Override
    @Transactional
    public UserDto createRecruiter(String companyAdminUsername, CreateRecruiterRequest request) {
        User companyAdmin = getCompanyAdminUser(companyAdminUsername);
        Company company = companyAdmin.getCompany();

        String cleanUsername = request.getUsername().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByUsername(cleanUsername)) {
            throw new ConflictException("Username is not available: @" + cleanUsername);
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new EmailAlreadyExistsException("Email address is already in use: " + request.getEmail());
        }

        // Validate initial password complexity
        String pwd = request.getPassword();
        if (pwd == null || pwd.length() < 8 
                || !pwd.matches(".*[A-Z].*") 
                || !pwd.matches(".*[0-9].*") 
                || !pwd.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new com.ats.backend.exception.InvalidRequestException("Initial password must be at least 8 characters long and contain at least one capital letter, one number, and one special character.");
        }

        Role recruiterRole = roleRepository.findByRoleName(RoleName.ROLE_RECRUITER)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_RECRUITER not found."));

        User recruiter = User.builder()
                .fullName(request.getFullName().trim())
                .username(cleanUsername)
                .email(request.getEmail().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(recruiterRole)
                .company(company)
                .enabled(true)
                .passwordChangeRequired(true) // Force first-time password change for recruiter
                .build();

        User savedUser = userRepository.save(recruiter);
        return userMapper.toDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getRecruitersPaginated(String companyAdminUsername, String search, Pageable pageable) {
        User companyAdmin = getCompanyAdminUser(companyAdminUsername);
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        Page<User> recruiters = userRepository.findUsersWithFilters(
                cleanSearch, 
                RoleName.ROLE_RECRUITER, 
                companyAdmin.getCompany().getId(), 
                pageable
        );
        return recruiters.map(userMapper::toDto);
    }

    @Override
    @Transactional
    public UserDto toggleRecruiterStatus(String companyAdminUsername, Long recruiterUserId, boolean enabled) {
        User companyAdmin = getCompanyAdminUser(companyAdminUsername);
        User recruiter = userRepository.findById(recruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + recruiterUserId));

        if (recruiter.getCompany() == null || !recruiter.getCompany().getId().equals(companyAdmin.getCompany().getId())) {
            throw new AccessDeniedException("You can only manage recruiters within your own company.");
        }

        recruiter.setEnabled(enabled);
        User updated = userRepository.save(recruiter);
        return userMapper.toDto(updated);
    }
}
