package org.javabugs.zenstudio.repository;

import org.javabugs.zenstudio.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
