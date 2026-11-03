package org.javabugs.zenstudio.repository;

import java.util.List;
import org.javabugs.zenstudio.domain.NotificationRecipient;
import org.javabugs.zenstudio.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, Long> {
    /** Bandeja de una alumna, más recientes primero. */
    List<NotificationRecipient> findByStudentOrderByNotificationCreatedAtDesc(Student student);
}
