# ZenStudio · App web de yoga (HTML + CSS + JavaScript)
Abrir `index.html` en el navegador (no requiere servidor ni dependencias).
- `js/store.js`: datos en localStorage, sesión, **permisos** (`need('admin')`) y reglas de negocio (cupos, lista FIFO, sellos, avisos).
- `js/views.js`: plantillas HTML por vista. `js/app.js`: tema, rutas con guardas por rol y eventos.
- `css/styles.css`: paleta verde/rosa y variables de modo claro/oscuro.
- Credenciales de prueba: admin@zenstudio.com / admin123 · alumna@zenstudio.com / alumna123.
- Reiniciar datos: borrar `zen_data_v2` y `zen_session_v2` del localStorage.
- Nota: sin backend, la autenticación es solo de demostración. Para producción migrar a Spring Boot + SQL (usuarios con hash, validación de rol en servidor).
