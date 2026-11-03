package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "class_session")
public class ClassSession {

    /** Cupo por defecto: tardes 12 (límite estricto), mañanas 15. */
    public enum Type {
        MORNING(15), AFTERNOON(12);
        private final int defaultCapacity;
        Type(int defaultCapacity) { this.defaultCapacity = defaultCapacity; }
        public int getDefaultCapacity() { return defaultCapacity; }
    }

    public enum Status { ACTIVE, CANCELLED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_date", nullable = false)
    private LocalDate classDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Type type;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private String instructor;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "cancel_reason")
    private String cancelReason;

    protected ClassSession() { }

    public ClassSession(LocalDate classDate, LocalTime startTime, Type type, String instructor) {
        this.classDate = classDate; this.startTime = startTime; this.type = type;
        this.instructor = instructor; this.capacity = type.getDefaultCapacity();
    }

    public void cancel(String reason) { this.status = Status.CANCELLED; this.cancelReason = reason; }

    public Long getId() { return id; }
    public LocalDate getClassDate() { return classDate; }
    public LocalTime getStartTime() { return startTime; }
    public Type getType() { return type; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public Status getStatus() { return status; }
    public String getCancelReason() { return cancelReason; }
}
