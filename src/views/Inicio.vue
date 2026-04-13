<script setup lang="ts">
import { appRoutes } from '../services/routerPaths'
</script>

<template>
  <section class="hero-card">
    <h1 class="hero-title">Apps Accesibles</h1>
    <p class="hero-copy">
      Coleccion de herramientas accesibles orientadas a tareas concretas. La
      primera aplicacion disponible es un editor cientifico para convertir
      expresiones LaTeX en MathML.
    </p>

    <article class="feature-card">
      <p class="feature-label">Aplicacion disponible</p>
      <h2>Editor Cientifico</h2>
      <p>
        Convierte expresiones LaTeX a MathML, visualiza el resultado en paralelo
        e inserta ejemplos matematicos frecuentes.
      </p>
      <RouterLink class="feature-link" :to="appRoutes.editorCientifico">
        Ir al Editor Cientifico
      </RouterLink>
    </article>
  </section>
</template>
