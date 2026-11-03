package org.javabugs.zenstudio.repository;

import java.util.List;
import org.javabugs.zenstudio.domain.ClassSession;
import org.javabugs.zenstudio.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    /** Con status WAITLIST devuelve la fila FIFO: la primera de la lista es la primera en subir. */
    List<Enrollment> findByClassSessionAndStatusOrderByCreatedAtAscIdAsc(ClassSession classSession, Enrollment.Status status);

    /** Para validar el cupo antes de inscribir. */
    long countByClassSessionAndStatus(ClassSession classSession, Enrollment.Status status);
}
