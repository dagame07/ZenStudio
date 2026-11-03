package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Notification {

    public enum Kind { INFO, ALERT, OK }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Kind kind;

    @Column(nullable = false, length = 500)
    private String message;

    /** Solo en avisos de cancelación: habilita "Reagendar en 1-clic". */
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cancelled_class_id")
    private ClassSession cancelledClass;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationRecipient> recipients = new ArrayList<>();

    protected Notification() { }

    public Notification(Kind kind, String message, ClassSession cancelledClass) {
        this.kind = kind; this.message = message; this.cancelledClass = cancelledClass;
    }

    public NotificationRecipient addRecipient(Student studentOrNullForAdmin) {
        NotificationRecipient r = new NotificationRecipient(this, studentOrNullForAdmin);
        recipients.add(r);
        return r;
    }

    public Long getId() { return id; }
    public Instant getCreatedAt() { return createdAt; }
    public Kind getKind() { return kind; }
    public String getMessage() { return message; }
    public ClassSession getCancelledClass() { return cancelledClass; }
    public List<NotificationRecipient> getRecipients() { return recipients; }
}
