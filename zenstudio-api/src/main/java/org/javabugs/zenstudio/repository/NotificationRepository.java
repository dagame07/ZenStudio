package org.javabugs.zenstudio.repository;

import org.javabugs.zenstudio.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
