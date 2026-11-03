package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;

/** Cuenta de acceso. La administradora no tiene Student; cada alumna con login sí. */
@Entity
@Table(name = "app_user")
public class AppUser {

    public enum Role { ADMIN, ALUMNA }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    /** Hash (BCrypt en el siguiente paso con Spring Security), nunca la contraseña en claro. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String name;

    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id")
    private Student student;

    protected AppUser() { }

    public AppUser(String email, String passwordHash, Role role, String name, Student student) {
        this.email = email; this.passwordHash = passwordHash; this.role = role; this.name = name; this.student = student;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public String getName() { return name; }
    public Student getStudent() { return student; }
}
