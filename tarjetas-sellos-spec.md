# SPEC: Sistema de Tarjeta de Sellos Digital (Módulo Principal)

## 1. Definición del Problema
El estudio de yoga de Andrea gestiona el control de asistencia mediante tarjetas de papel físicas que se sellan manualmente por cada clase tomada en paquetes de 10. Este sistema presenta tres problemas críticos:
1. **Falta de visibilidad:** Las alumnas no pueden consultar cuántas clases les quedan a menos que tengan el cartón en la mano.
2. **Pérdida de control:** Las tarjetas físicas se pierden, dañan o se prestan, generando discrepancias en las clases pagadas frente a las tomadas.
3. **Escalabilidad:** Andrea pierde tiempo valioso sellando manualmente y auditando quién tiene paquetes activos o vencidos.

## 2. Diseño de la Solución
Se implementará un componente digital reactivo que simule la tarjeta física dentro de la aplicación, actuando como la única fuente de verdad para el saldo de clases.

*   **Acceso y Permisos (Seguridad):** 
    *   La vista de la tarjeta estará disponible tanto para el perfil de Alumna como de Administradora.
    *   **Permiso de Escritura:** Únicamente el rol de Administrador (`admin@zenstudio.com`) tendrá botones habilitados para "Agregar Sello" o "Remover Sello".
    *   **Permiso de Lectura:** El rol de Alumna (`alumna@zenstudio.com`) verá la tarjeta en modo estrictamente de solo lectura. No existirá ningún endpoint ni botón en su interfaz que permita alterar los datos.
*   **Diseño Visual:** Una cuadrícula/contenedor con 10 círculos indexados. Los círculos cambian de estado visual (Vacío / Sellado con un icono representativo) según el número de clases tomadas.
*   **Persistencia:** El estado de los sellos de cada usuario se almacenará y actualizará en `localStorage` bajo la estructura de datos del usuario, evitando que se reinicie al actualizar el navegador.
*   **Regla de Negocio Bloqueante:** Cuando el contador de sellos llegue a 10, el sistema cambiará el estado del paquete a "Agotado", deshabilitará automáticamente el botón de inscripción a nuevas clases para esa alumna y enviará una alerta visual en el panel de Andrea.

## 3. Criterios de Aceptación Verificables
1. **Verificación de Restricción de Roles:** Al iniciar sesión como `alumna@zenstudio.com`, el componente de la tarjeta de sellos no debe renderizar ningún botón de edición, interacción o alteración del estado de los sellos.
2. **Verificación de Persistencia:** Al iniciar sesión como `admin@zenstudio.com`, agregar 3 sellos a la cuenta de la alumna de prueba y recargar la página (`F5`), la tarjeta de la alumna debe mantener exactamente los 3 sellos guardados.
3. **Verificación del Límite de Bloqueo:** Cuando el Administrador asigna el décimo sello (10/10) a un usuario, la interfaz de ese usuario debe mostrar un estado bloqueado con la leyenda "Paquete Agotado" y el botón para agendar nuevas clases en el calendario debe quedar inhabilitado (`disabled`).
4. **Verificación de Reversibilidad:** El administrador debe poder remover un sello en caso de error humano (ej. pasar de 4 sellos a 3 sellos), actualizando inmediatamente la interfaz visual y el espacio en `localStorage`.
