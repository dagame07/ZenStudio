package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Stamp {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "stamp_date", nullable = false)
    private LocalDate stampDate;

    @Column(name = "package_number", nullable = false)
    private int packageNumber;

    /** Clase que originó el sello (null si Andrea lo agregó manualmente). */
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "class_session_id")
    private ClassSession classSession;

    protected Stamp() { }

    Stamp(Student student, LocalDate stampDate, int packageNumber, ClassSession classSession) {
        this.student = student; this.stampDate = stampDate; this.packageNumber = packageNumber; this.classSession = classSession;
    }

    public Long getId() { return id; }
    public LocalDate getStampDate() { return stampDate; }
    public int getPackageNumber() { return packageNumber; }
    public ClassSession getClassSession() { return classSession; }
}
