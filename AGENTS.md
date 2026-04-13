# AGENTS.md

## Propósito

Este fichero define reglas prácticas para cualquier agente o persona que modifique este proyecto.

El objetivo principal es evitar regresiones en tres zonas delicadas:

- Las rutas entre desarrollo y producción.
- El render matemático del editor científico.
- Los conversores de texto y braille.

## Reglas generales

- Mantener todo el contenido y documentación en español salvo necesidad técnica puntual.
- No introducir cambios grandes en varias áreas a la vez si no son necesarios.
- Antes de cerrar una tarea, ejecutar `pnpm build`.
- No asumir que un cambio visual pequeño es inocuo si afecta a CSS global.

## Rutas

- La app usa `createWebHistory`, no `hash`.
- La base de desarrollo es `/`.
- La base de producción es `/appsaccesibles/`.
- No duplicar literales de rutas en componentes.
- Cualquier ruta o enlace nuevo debe salir de `src/services/routerPaths.ts`.

Si se toca navegación:

- Revisar `src/main.ts`
- Revisar `src/services/routerPaths.ts`
- Revisar `src/App.vue`
- Revisar enlaces en vistas como `Inicio.vue`

## GitHub Pages

- No eliminar `public/404.html` sin sustituirlo por otra solución equivalente.
- No quitar la restauración de ruta de `index.html` si la app sigue desplegándose en GitHub Pages.
- Si cambias `BASE_URL`, valida también el flujo de recarga con `F5`.

## Editor científico

El editor científico es una zona sensible.

### Reglas de seguridad para MathML

- No aplicar estilos agresivos a `math`, `mi`, `mo`, `mn`, `mrow`, `mfrac`, `msup`, `msub`, `msqrt`, `mroot` y similares.
- No añadir reglas sobre `display`, `flex`, `grid`, `width`, `writing-mode`, `word-break`, `unicode-bidi`, `direction` o `text-orientation` a nodos internos de MathML salvo que haya una razón muy justificada y una prueba visual clara.
- Estilizar el contenedor externo, no la estructura interna de la fórmula.
- Si Chrome renderiza una fórmula en vertical, sospechar primero del CSS.

### Qué revisar si se rompe el render

1. `src/style.css`
2. `src/components/MathMlPreview.vue`
3. `src/lib/mathjax.ts`
4. El DOM real que llega al navegador

### Qué no hacer

- No volver a meter parches improvisados de render con varias estrategias a la vez.
- No mezclar en la misma tarea MathML nativo, SVG de MathJax y HTML alternativo sin una decisión clara.
- No introducir cambios en la preview del editor si no se puede validar visualmente después.

## TALP y BLAT

- `src/services/useTalp.ts` y `src/services/useBlat.ts` son la fuente de verdad de la conversión.
- No mover esa lógica a componentes de vista.
- Si se cambia una regla de conversión, intentar mantener la coherencia entre ida y vuelta.
- Cuando se toque BLAT, comprobar que la salida siga siendo útil como texto o como entrada de LaTeX si aplica.

## CSS

- Evitar selectores globales agresivos.
- No usar reglas del tipo `*`, `.panel *` o `.preview *` para cambiar layout de todos los descendientes si el panel contiene matemáticas.
- Si se necesita ajustar un componente, preferir clases específicas y acotadas.

## Checklist mínimo antes de terminar

- Ejecutar `pnpm build`.
- Revisar que no se hayan roto rutas.
- Revisar que el editor científico sigue mostrando fórmulas.
- Revisar que `TextoBraille` sigue convirtiendo en ambos sentidos.

## Prioridad de estabilidad

Si hay duda entre una solución elegante y una solución estable:

- Priorizar la estable.
- Documentar la limitación en `README.md` si hace falta.
