# Apps Accesibles

Aplicación web construida con Vue 3, Vite y TypeScript para reunir herramientas accesibles orientadas a tareas concretas.

Actualmente incluye:

- Un editor científico que convierte expresiones LaTeX a MathML.
- Un conversor bidireccional entre texto y braille textual inspirado en los scripts legacy `talp.cgi` y `blat.pl`.

## Tecnologías

- Vue 3
- Vite
- TypeScript
- Vue Router
- Bootstrap 5
- MathJax

## Estructura del proyecto

- `src/views/Inicio.vue`: portada de la aplicación.
- `src/views/EditorCientifico.vue`: editor de LaTeX con salida MathML.
- `src/views/TextoBraille.vue`: interfaz única para texto a braille y braille a texto.
- `src/services/useTalp.ts`: conversión de texto a braille textual.
- `src/services/useBlat.ts`: conversión de braille textual a texto.
- `src/services/routerPaths.ts`: construcción centralizada de rutas según `BASE_URL`.
- `src/lib/mathjax.ts`: utilidades para convertir LaTeX a MathML.
- `src/components/MathMlPreview.vue`: montaje seguro de MathML en el DOM.
- `src/style.css`: estilos globales de la aplicación.

## Desarrollo

Instalación de dependencias:

```bash
pnpm install
```

Servidor de desarrollo:

```bash
pnpm dev
```

Compilación de producción:

```bash
pnpm build
```

Vista previa local del build:

```bash
pnpm preview
```

## Rutas

La aplicación usa historial web, no `hash`.

- En desarrollo, `BASE_URL` es `/`.
- En producción, `BASE_URL` es `/appsaccesibles/`.
- Las rutas se construyen desde `src/services/routerPaths.ts` para evitar inconsistencias entre router y enlaces.

Rutas actuales:

- `/`
- `/editor-cientifico`
- `/texto-braille`

En producción quedan publicadas bajo:

- `/appsaccesibles/`
- `/appsaccesibles/editor-cientifico`
- `/appsaccesibles/texto-braille`

## GitHub Pages

El proyecto incluye soporte para recarga directa en GitHub Pages sin volver al `#`.

- `public/404.html` guarda la ruta solicitada y redirige a la raíz publicada.
- `index.html` restaura esa ruta al cargar la SPA.

Esto evita el `404` al pulsar `F5` en rutas internas publicadas bajo `/appsaccesibles/...`.

## Editor científico

El editor científico transforma LaTeX en MathML usando MathJax y muestra:

- Una previsualización renderizada a partir del MathML generado.
- El código MathML para inspección manual.

### Restricción importante sobre estilos

El render matemático es sensible al CSS. Ya hubo un problema real en Chrome donde expresiones simples como `a + b = c` se mostraban en vertical.

Para evitarlo:

- No añadir estilos agresivos sobre `math`, `mi`, `mo`, `mn`, `mrow` y nodos similares.
- No aplicar reglas globales como `display`, `flex`, `grid`, `width: 100%`, `writing-mode`, `word-break` o `unicode-bidi` a nodos MathML.
- Estilizar solo el contenedor externo del panel, no la estructura interna de MathML.
- Si vuelve a fallar en Chrome, revisar primero el CSS antes de tocar MathJax o el contenido MathML.

## Conversor Texto y Braille

La vista `TextoBraille.vue` agrupa dos modos:

- Texto a Braille
- Braille a Texto

Las conversiones se ejecutan en cliente, sin peticiones al servidor.

### TALP

`useTalp.ts` implementa una portación práctica del conversor legacy de texto a braille textual.

Incluye:

- Números
- Fracciones
- Signos frecuentes
- Delimitación de bloques matemáticos
- Parte de la notación matemática usada por los scripts originales

### BLAT

`useBlat.ts` implementa la conversión inversa, orientada a devolver texto útil y expresiones aptas para seguir tratándose como LaTeX cuando corresponde.

## Estado actual

El proyecto está pensado como una base funcional y mantenible, no como una reproducción exhaustiva de todos los comportamientos legacy.

Eso implica:

- La parte principal de TALP y BLAT está portada y usable.
- Puede haber casos límite del Perl original aún no cubiertos al 100%.
- Cualquier cambio en rutas, render matemático o conversión debe validarse con `pnpm build`.

## Recomendaciones al modificar

- Mantener `routerPaths.ts` como única fuente de verdad para rutas internas.
- Probar siempre el editor científico en Chrome y Safari cuando se toque CSS o MathML.
- Evitar resets CSS agresivos en el panel de salida matemática.
- No introducir cambios de renderizado matemático sin una comprobación visual posterior.
