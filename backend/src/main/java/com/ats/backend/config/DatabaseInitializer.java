package com.ats.backend.config;

import com.ats.backend.entity.Role;
import com.ats.backend.entity.RoleName;
import com.ats.backend.entity.User;
import com.ats.backend.repository.RoleRepository;
import com.ats.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final com.ats.backend.repository.CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(RoleRepository roleRepository, UserRepository userRepository, com.ats.backend.repository.CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().roleName(roleName).build());
            }
        }

        // Initialize a default ADMIN, COMPANY_ADMIN, RECRUITER, and CANDIDATE for testing convenience
        Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow();
        Role companyAdminRole = roleRepository.findByRoleName(RoleName.ROLE_COMPANY_ADMIN).orElseThrow();
        Role recruiterRole = roleRepository.findByRoleName(RoleName.ROLE_RECRUITER).orElseThrow();
        Role candidateRole = roleRepository.findByRoleName(RoleName.ROLE_CANDIDATE).orElseThrow();

        com.ats.backend.entity.Company defaultCompany = companyRepository.findByName("Acme Corp")
                .orElseGet(() -> companyRepository.save(com.ats.backend.entity.Company.builder()
                        .name("Acme Corp")
                        .domain("acme.com")
                        .hiringPreferences("Prefers candidates with strong hands-on coding and systems knowledge.")
                        .build()));

        if (userRepository.findByEmailOrUsername("admin@ats.com", "admin").isEmpty()) {
            userRepository.save(User.builder()
                    .fullName("System Admin")
                    .username("admin")
                    .email("admin@ats.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .enabled(true)
                    .build());
            System.out.println("Seeded Super Admin: admin@ats.com / admin123");
        }

        if (userRepository.findByEmailOrUsername("companyadmin@ats.com", "companyadmin").isEmpty()) {
            userRepository.save(User.builder()
                    .fullName("Alice Admin")
                    .username("companyadmin")
                    .email("companyadmin@ats.com")
                    .password(passwordEncoder.encode("companyadmin123"))
                    .role(companyAdminRole)
                    .company(defaultCompany)
                    .enabled(true)
                    .build());
            System.out.println("Seeded Company Admin: companyadmin@ats.com / companyadmin123");
        }

        if (userRepository.findByEmailOrUsername("recruiter@ats.com", "recruiter").isEmpty()) {
            userRepository.save(User.builder()
                    .fullName("John Recruiter")
                    .username("recruiter")
                    .email("recruiter@ats.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(recruiterRole)
                    .company(defaultCompany)
                    .enabled(true)
                    .build());
            System.out.println("Seeded Recruiter: recruiter@ats.com / recruiter123");
        }

        if (userRepository.findByEmailOrUsername("candidate@ats.com", "candidate").isEmpty()) {
            userRepository.save(User.builder()
                    .fullName("Jane Candidate")
                    .username("candidate")
                    .email("candidate@ats.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .role(candidateRole)
                    .enabled(true)
                    .build());
            System.out.println("Seeded Candidate: candidate@ats.com / candidate123");
        }
    }
}
