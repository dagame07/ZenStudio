package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.Instant;

/** Inscripción o lugar en lista de espera. La lista de espera es FIFO: se ordena por createdAt e id. */
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"class_session_id", "student_id"}))
public class Enrollment {

    public enum Status { ENROLLED, WAITLIST }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "class_session_id")
    private ClassSession classSession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "student_id")
    private Student student;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    /** true cuando Andrea ya selló la asistencia de esta clase. */
    @Column(nullable = false)
    private boolean attended = false;

    protected Enrollment() { }

    public Enrollment(ClassSession classSession, Student student, Status status) {
        this.classSession = classSession; this.student = student; this.status = status;
    }

    public Long getId() { return id; }
    public ClassSession getClassSession() { return classSession; }
    public Student getStudent() { return student; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }
}
