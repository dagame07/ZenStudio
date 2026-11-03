package org.javabugs.zenstudio.repository;

import java.util.Optional;
import org.javabugs.zenstudio.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}
