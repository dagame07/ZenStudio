package org.javabugs.zenstudio.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Alumna y su tarjeta de sellos. El historial de paquetes se conserva: renovar solo incrementa packageNumber. */
@Entity
public class Student {

    public static final int PACKAGE_SIZE = 10;

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "package_number", nullable = false)
    private int packageNumber = 1;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stampDate ASC, id ASC")
    private List<Stamp> stamps = new ArrayList<>();

    protected Student() { }

    public Student(String name) { this.name = name; }

    public long currentStampCount() {
        return stamps.stream().filter(s -> s.getPackageNumber() == packageNumber).count();
    }

    public boolean isPackageExhausted() { return currentStampCount() >= PACKAGE_SIZE; }

    /** Solo la administradora debe llamar esto (se valida en la capa de servicio/seguridad). */
    public Stamp addStamp(LocalDate date, ClassSession from) {
        if (isPackageExhausted()) throw new IllegalStateException("Paquete Agotado");
        Stamp stamp = new Stamp(this, date, packageNumber, from);
        stamps.add(stamp);
        return stamp;
    }

    public void removeLastStamp() {
        for (int i = stamps.size() - 1; i >= 0; i--) {
            if (stamps.get(i).getPackageNumber() == packageNumber) { stamps.remove(i); return; }
        }
    }

    public void renewPackage() { packageNumber++; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getPackageNumber() { return packageNumber; }
    public List<Stamp> getStamps() { return stamps; }
}
