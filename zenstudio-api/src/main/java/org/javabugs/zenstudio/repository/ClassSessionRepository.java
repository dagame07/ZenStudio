package org.javabugs.zenstudio.repository;

import java.time.LocalDate;
import java.util.List;
import org.javabugs.zenstudio.domain.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    /** Clases de un rango (p. ej. un mes) para el calendario. */
    List<ClassSession> findByClassDateBetweenOrderByClassDateAscStartTimeAsc(LocalDate from, LocalDate to);
}
