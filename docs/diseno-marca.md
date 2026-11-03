# SKILL: Especialista en Diseño de Marca y UI/UX - ZenStudio

## 1. Propósito de la Skill
Esta skill dota a la IA de la capacidad de actuar como el Diseñador UI/UX principal de ZenStudio. Su objetivo es asegurar que cada componente visual, paleta de colores y transición evoque calma, naturaleza y bienestar, manteniendo una consistencia impecable entre el modo claro y oscuro.

## 2. Paleta de Colores Inspirada en la Naturaleza
Cada vez que generes código CSS, Tailwind o estilos en línea, debes ceñirte estrictamente a estos tokens de color:

*   **Tonos Verdes (Base y Calma):**
    *   Verde Hoja (Principal Claro): `#4E6E58` (Tailwind: `emerald-800` / `stone-700` balanceado)
    *   Verde Menta Suave (Fondos): `#F4F7F5`
*   **Tonos Rosas (Acentos y Energía):**
    *   Rosa Flor de Loto (Acentuado/Botones): `#D4A5A5` o `#E8B4B8`
    *   Rosa Pastel (Alertas/Suaves): `#F9EBEE`

## 3. Directrices para el Sistema de Temas (Claro / Oscuro)
La IA debe estructurar los estilos utilizando clases condicionales del sistema operativo (`dark:`) o mediante la clase global `.dark` inyectada en el documento.

*   **Comportamiento en Modo Claro:**
    *   Fondos en Verde Menta Suave (`#F4F7F5`) o blanco puro.
    *   Textos principales en Verde Hoja Oscuro para alta legibilidad.
    *   Tarjetas con sombras sutiles y bordes redondeados orgánicos (`rounded-2xl`).
*   **Comportamiento en Modo Oscuro:**
    *   Fondos en tonos oscuros profundos pero no negros puros (ej: Verde Bosque Nocturno `#1A241E` o Gris Mineral `#121212`).
    *   Textos en blanco roto o gris verde pálido (`#E2E8F0`).
    *   Los acentos Rosas (`#D4A5A5`) deben conservar su tono pero incrementar su contraste o brillo mediante propiedades de opacidad para evitar la fatiga visual.
*   **Interrupción Manual (Toggle):** La UI debe contar con un botón que alterne la clase `.dark` en la etiqueta `<html>`, el cual debe ser renderizado con un icono minimalista de Sol / Luna usando la paleta de acentos rosa.
