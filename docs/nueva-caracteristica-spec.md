# SPEC: Módulo de Reagendación Reactiva e Instantánea por Cancelación

## 1. Definición del Problema
Cuando una instructora se enferma, Andrea (Administradora) cancela la clase. El sistema actual envía una notificación pasiva, pero obliga a la alumna (como Bruna Reyes) a navegar manualmente por el calendario, buscar otra clase disponible, verificar si hay cupo y volver a agendar. Este proceso genera fricción, retrasos y sobrecarga el soporte manual de Andrea por WhatsApp.

## 2. Diseño de la Solución
Implementar una acción directa e inteligente dentro de la misma tarjeta de notificación de cancelación. En cuanto la alumna abra su app y vea la alerta de "Clase Cancelada", tendrá un botón interactivo llamado **"Reagendar en 1-Clic"**. 

Al presionarlo, el sistema leerá los horarios disponibles de la misma semana con la misma instructora (o una clase equivalente) y le ofrecerá alternativas rápidas de manera reactiva, ejecutando el cambio inmediatamente y devolviendo el "sello" virtual de forma transparente.

## 3. Criterios de Aceptación Verificables
- [ ] **Acción Directa:** La notificación de cancelación debe renderizar un botón visible de "Reagendar" únicamente si el estado de la clase asignada cambió a "Cancelado" por el administrador.
- [ ] **Sugerencia Inteligente:** Al hacer clic en Reagendar, el componente debe desplegar un menú desplegable simplificado que liste únicamente las clases con cupo disponible (< 12 alumnas si es en la tarde) en los próximos 7 días.
- [ ] **Consumo Automático de Sello:** Al confirmar la nueva fecha, la clase cancelada se elimina del historial de la alumna, la nueva clase se añade al calendario de asistencia y el contador de la tarjeta de 10 sellos **no debe alterarse** (neto: 0 cambios erróneos en el paquete).
- [ ] **Persistencia Inmediata:** Los cambios de la nueva clase reagendada deben actualizarse instantáneamente en el `localStorage` tanto para la alumna como en la vista de control mensual de Andrea.

## 4. Métricas de Éxito (Product Success Metrics)
*   **Tasa de Conversión de Reagendación (CTR):** > 85% de las alumnas afectadas por una cancelación deben reagendar exitosamente a través del botón de la notificación en las primeras 4 horas, reduciendo las dudas por mensaje directo.
*   **Tiempo de Operación de Reagendado (Task Completion Time):** El usuario debe ser capaz de completar el proceso de selección y confirmación de la nueva clase en menos de **15 segundos** desde que abre la notificación.
*   **Frecuencia de Errores de Cupo:** 0 casos de sobrecupo (más de 12 alumnas) provocados por el proceso automático de reagendación en las clases de la tarde.
