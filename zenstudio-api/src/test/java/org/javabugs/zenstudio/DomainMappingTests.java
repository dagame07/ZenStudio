package org.javabugs.zenstudio;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.javabugs.zenstudio.domain.ClassSession;
import org.javabugs.zenstudio.domain.Enrollment;
import org.javabugs.zenstudio.domain.Student;
import org.javabugs.zenstudio.repository.ClassSessionRepository;
import org.javabugs.zenstudio.repository.EnrollmentRepository;
import org.javabugs.zenstudio.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class DomainMappingTests {

    @Autowired StudentRepository students;
    @Autowired ClassSessionRepository classes;
    @Autowired EnrollmentRepository enrollments;

    @Test
    void tarjetaSeAgotaAlDecimoSelloYRenovarLaReinicia() {
        Student s = students.save(new Student("Bruna Reyes"));
        for (int i = 0; i < Student.PACKAGE_SIZE; i++) s.addStamp(LocalDate.now().minusDays(i), null);
        final Student card = students.save(s);

        assertTrue(card.isPackageExhausted());
        assertThrows(IllegalStateException.class, () -> card.addStamp(LocalDate.now(), null));

        card.removeLastStamp();
        assertFalse(card.isPackageExhausted());
        assertEquals(9, card.currentStampCount());

        card.addStamp(LocalDate.now(), null);
        card.renewPackage();
        assertEquals(0, card.currentStampCount());
        assertEquals(10, card.getStamps().size()); // el historial se conserva
    }

    @Test
    void cupoDeTardeEs12YListaDeEsperaEsFifo() {
        ClassSession c = classes.save(new ClassSession(LocalDate.now().plusDays(1), LocalTime.of(18, 30), ClassSession.Type.AFTERNOON, "Mariana"));
        assertEquals(12, c.getCapacity());

        Student a = students.save(new Student("A"));
        Student b = students.save(new Student("B"));
        enrollments.save(new Enrollment(c, a, Enrollment.Status.WAITLIST));
        enrollments.save(new Enrollment(c, b, Enrollment.Status.WAITLIST));

        List<Enrollment> waitlist = enrollments.findByClassSessionAndStatusOrderByCreatedAtAscIdAsc(c, Enrollment.Status.WAITLIST);
        assertEquals(a.getId(), waitlist.get(0).getStudent().getId());
        assertEquals(2, enrollments.countByClassSessionAndStatus(c, Enrollment.Status.WAITLIST));
    }
}
