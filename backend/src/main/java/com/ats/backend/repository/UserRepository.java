package com.ats.backend.repository;

import com.ats.backend.entity.User;
import com.ats.backend.entity.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmailOrUsername(String email, String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Page<User> findByRoleRoleName(RoleName roleName, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN u.company c WHERE " +
            "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:roleName IS NULL OR u.role.roleName = :roleName) AND " +
            "(:companyId IS NULL OR (c IS NOT NULL AND c.id = :companyId))")
    Page<User> findUsersWithFilters(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("roleName") RoleName roleName,
            @org.springframework.data.repository.query.Param("companyId") Long companyId,
            Pageable pageable);
}
