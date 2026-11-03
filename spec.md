# SPEC: Refactorización, Control de Acceso y Estética - App Web ZenStudio (Andrea Yoga)

## 1. Contexto del Negocio y Objetivo
- **Cliente:** Andrea, dueña del estudio de yoga.
- **Audiencia:** Alumnas, Instructoras y Administradora (Andrea).
- **Meta del negocio:** Digitalizar el sistema físico de "tarjetas de papel con sellos" para paquetes de 10 clases, restringir el acceso según roles, gestionar cupos de la tarde (máx. 12) con lista de espera y automatizar alertas inmediatas.
- **Identidad de Marca:** Interfaz inspirada en la naturaleza con una paleta de colores basada en **tonos verdes y rosas**, adaptiva a las preferencias de luz del sistema del usuario.
- **Objetivo de este Spec:** Refactorizar el código existente de Vibe Coding. Se deben implementar capas de autenticación con credenciales fijas, restricción estricta de modificación de datos, reactividad en notificaciones, soporte nativo de temas (claro/oscuro) y asegurar la persistencia de datos.

## 2. Reglas de Negocio Estrictas y Sistema de Roles

### A. Autenticación y Credenciales de Prueba Fijadas
La aplicación debe iniciar obligatoriamente en un formulario de acceso. No se puede navegar a la app sin iniciar sesión. Se deben configurar de manera fija en el código las siguientes credenciales para evaluar el comportamiento:

*   **Usuario Administrador (Andrea):**
    *   **Email:** `admin@zenstudio.com`
    *   **Contraseña:** `admin123`
*   **Usuario Alumna de Prueba:**
    *   **Email:** `alumna@zenstudio.com`
    *   **Contraseña:** `alumna123`

### B. Restricción de Vistas y Permisos Críticos (Seguridad)
*   **Rol Administrador (Andrea):** Único usuario con permisos para visualizar, entrar y operar el panel de control, modificar cupos, agregar/cancelar clases y gestionar paquetes.
*   **Rol Alumna:** Solo visualiza su tarjeta de sellos digital, el calendario de clases para inscripción y su bandeja de notificaciones. Tiene estrictamente prohibido ver o interactuar con las rutas/vistas de administración. Si intenta ingresar a una ruta administrativa, debe ser redirigida al dashboard de alumna.

### C. Control de Tarjeta de Sellos Digital (Paquetes de 10)
*   **Diseño Visual:** Debe conservar una interfaz que simule una tarjeta física con 10 casillas o círculos para facilitar la adaptabilidad de las alumnas.
*   **Permisos de Modificación de Sellos:** **Únicamente el usuario Administrador (Andrea) puede agregar, quitar o modificar sellos manualmente desde su panel de control.** Las alumnas tienen acceso de "solo lectura" a su tarjeta; bajo ninguna circunstancia pueden sumarse sellos a sí mismas de forma manual.
*   **Lógica de Descuento:** Cada asistencia válida resta 1 clase del paquete. Al llegar a 10 sellos, se bloquean nuevas reservas y se alerta a Andrea. Los datos deben persistir en `localStorage`.

### D. Notificaciones Instantáneas de Cancelación
*   **Disparador Inmediato:** En el momento exacto en que la Administradora confirme la cancelación de una clase en su panel, el sistema debe cambiar el estado de la clase y **generar una notificación reactiva al instante**.
*   **Audiencia Afectada:** La notificación de "Clase cancelada - Favor de reagendar" debe mostrarse de manera prioritaria y visible en cuanto la alumna afectada inicie sesión o se encuentre navegando en la app.

### E. Calendario Mensual, Cupos y Lista de Espera (Clases de la Tarde)
*   **Regla de Cupo:** Las clases de la tarde tienen un límite estricto de **12 alumnas**.
*   **Lógica de Lista de Espera:** Tipo FIFO (primera en entrar, primera en salir). Si una alumna inscrita cancela, el sistema mueve automáticamente a la primera de la lista de espera al grupo principal de 12.

## 3. Interfaz Visual, Estilo y Modos de Color

### A. Paleta de Colores (Naturaleza)
*   La interfaz debe utilizar una combinación armónica de **Verdes y Rosas** que evoquen bienestar, calma y elementos naturales (ej. verde hojas, rosa flor de loto).

### B. Modo Claro / Modo Oscuro Adaptivo
*   **Detección del Sistema:** La aplicación debe leer las preferencias del sistema operativo del usuario (`prefers-color-scheme`) para arrancar automáticamente en modo claro u oscuro según corresponda.
*   **Control Manual (Toggle Button):** Debe existir un botón o interruptor visible en la barra de navegación que permita al usuario forzar el cambio de modo en cualquier momento, ignorando temporalmente la configuración del sistema.
*   **Adaptación Estética:** El modo oscuro debe conservar la esencia de colores rosas y verdes del estudio, adaptando los fondos a tonos oscuros/profundos y los textos a alto contraste.

## 4. Exclusiones de Alcance (NO IMPLEMENTAR)
*   Pasarelas de pago reales o tienda en línea.
*   Reproductores de video o repositorios de rutinas de yoga.
*   Base de datos externa o backend complejo (todo se maneja localmente con `localStorage`).

## 5. Criterios de Aceptación para la IA (Checklist de Validación)
- [ ] El sistema bloquea el acceso total a la app si no se ingresa con las credenciales fijadas (`admin@zenstudio.com` o `alumna@zenstudio.com`).
- [ ] La interfaz de la Alumna no muestra ningún botón, entrada ni función que le permita alterar el contador o los sellos de su tarjeta (Solo Lectura).
- [ ] Al presionar "Confirmar Cancelación" en el perfil de Andrea, la alerta de reagendación aparece inmediatamente en las cuentas de las alumnas inscritas.
- [ ] El botón de cambio de modo (Claro/Oscuro) alterna correctamente los estilos visuales manteniendo los acentos verdes y rosas.
- [ ] Las tarjetas de sellos y estados del calendario persisten de forma correcta tras actualizar la ventana del navegador.
