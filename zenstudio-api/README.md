# ZenStudio API (Spring Boot 3 · Java 17 · Gradle)

Base del backend para reemplazar el `localStorage` del front. Esta fase **solo prepara** el proyecto:
modelo de datos (JPA), repositorios, CORS y un endpoint de salud. Aún no hay endpoints de negocio ni login.

## Arranque (hoy, sin instalar base de datos)
1. JDK 17. Abre la carpeta en IntelliJ (importa Gradle) o, con Gradle instalado, ejecuta una vez `gradle wrapper`.
2. `./gradlew bootRun` → http://localhost:8080/api/health debe responder `{"status":"UP","database":"H2",...}`.
3. `./gradlew test` valida el mapeo de entidades, la regla de 10 sellos, el cupo de 12 y la lista FIFO.
Perfil por defecto: `dev` (H2 en memoria, datos se pierden al apagar; consola en /h2-console).

## Siguiente paso: MySQL
Variables de entorno y perfil:
```
SPRING_PROFILES_ACTIVE=mysql
DB_URL=jdbc:mysql://HOST:3306/zenstudio      (si el proveedor exige SSL, agrega ?sslMode=REQUIRED)
DB_USER=...   DB_PASSWORD=...
```
`ddl-auto: update` crea las tablas en el primer arranque; después conviene Flyway y `validate`.

## Modelo (paquete `org.javabugs.zenstudio.domain`)
`AppUser` (ADMIN/ALUMNA, contraseña con hash) · `Student` (paquete y sellos con historial) · `Stamp` · `ClassSession` (cupo 12 tarde / 15 mañana, estado cancelada) · `Enrollment` (inscrita o lista de espera FIFO) · `Notification` + `NotificationRecipient` (leído y "reagendada").

## Pendiente (siguientes fases)
Spring Security + BCrypt, servicios con las reglas de `store.js`, endpoints REST y conectar el front con `fetch`.
CORS: define `CORS_ORIGINS` con el dominio de Vercel/Netlify.
