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
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
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

        // Initialize a default ADMIN, RECRUITER, and CANDIDATE for testing convenience
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow();
            Role recruiterRole = roleRepository.findByRoleName(RoleName.ROLE_RECRUITER).orElseThrow();
            Role candidateRole = roleRepository.findByRoleName(RoleName.ROLE_CANDIDATE).orElseThrow();

            userRepository.save(User.builder()
                    .fullName("System Admin")
                    .email("admin@ats.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .enabled(true)
                    .build());

            userRepository.save(User.builder()
                    .fullName("John Recruiter")
                    .email("recruiter@ats.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(recruiterRole)
                    .enabled(true)
                    .build());

            userRepository.save(User.builder()
                    .fullName("Jane Candidate")
                    .email("candidate@ats.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .role(candidateRole)
                    .enabled(true)
                    .build());

            System.out.println("ATS System initialized with default users:");
            System.out.println("  Admin: admin@ats.com / admin123");
            System.out.println("  Recruiter: recruiter@ats.com / recruiter123");
            System.out.println("  Candidate: candidate@ats.com / candidate123");
        }
    }
}
