zenstudio/                          ← raíz del repo en GitHub (el nombre que tengas)
├── README.md
├── .gitignore
│
├── zenstudio/                      ← FRONT (estático, el que se despliega en Vercel/Netlify)
│   ├── index.html
│   ├── README.md
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── store.js
│       ├── views.js
│       └── app.js
│
└── zenstudio-api/                  ← BACKEND (Spring Boot, Gradle, Java 17)
    ├── build.gradle
    ├── settings.gradle
    ├── .gitignore
    ├── README.md
    ├── gradlew                     ← aparecen al correr `gradle wrapper` (o al importar en IntelliJ)
    ├── gradlew.bat
    ├── gradle/
    │   └── wrapper/
    │       ├── gradle-wrapper.jar
    │       └── gradle-wrapper.properties
    └── src/
        ├── main/
        │   ├── java/org/javabugs/zenstudio/
        │   │   ├── ZenStudioApplication.java
        │   │   ├── config/
        │   │   │   └── CorsConfig.java
        │   │   ├── domain/
        │   │   │   ├── AppUser.java
        │   │   │   ├── ClassSession.java
        │   │   │   ├── Enrollment.java
        │   │   │   ├── Notification.java
        │   │   │   ├── NotificationRecipient.java
        │   │   │   ├── Stamp.java
        │   │   │   └── Student.java
        │   │   ├── repository/
        │   │   │   ├── AppUserRepository.java
        │   │   │   ├── ClassSessionRepository.java
        │   │   │   ├── EnrollmentRepository.java
        │   │   │   ├── NotificationRecipientRepository.java
        │   │   │   ├── NotificationRepository.java
        │   │   │   └── StudentRepository.java
        │   │   └── web/
        │   │       └── HealthController.java
        │   └── resources/
        │       ├── application.yml
        │       ├── application-dev.yml
        │       └── application-mysql.yml
        └── test/
            └── java/org/javabugs/zenstudio/
                ├── DomainMappingTests.java
                └── ZenStudioApplicationTests.java