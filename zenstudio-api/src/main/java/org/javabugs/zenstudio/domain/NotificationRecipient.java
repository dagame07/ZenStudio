package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.Instant;

/** Estado de un aviso para cada destinatario (leído / reagendado). student = null significa bandeja de la administradora. */
@Entity
@Table(name = "notification_recipient")
public class NotificationRecipient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "notification_id")
    private Notification notification;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "read_at")
    private Instant readAt;

    /** Nueva clase elegida con "Reagendar en 1-clic" (null si aún no reagenda). */
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "rescheduled_to_id")
    private ClassSession rescheduledTo;

    protected NotificationRecipient() { }

    NotificationRecipient(Notification notification, Student student) {
        this.notification = notification; this.student = student;
    }

    public Long getId() { return id; }
    public Notification getNotification() { return notification; }
    public Student getStudent() { return student; }
    public Instant getReadAt() { return readAt; }
    public void markRead() { if (readAt == null) readAt = Instant.now(); }
    public ClassSession getRescheduledTo() { return rescheduledTo; }
    public void setRescheduledTo(ClassSession rescheduledTo) { this.rescheduledTo = rescheduledTo; }
}
