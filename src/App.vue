<script setup lang="ts">
import { ref } from 'vue'
import { appRoutes } from './services/routerPaths'

const isNavbarOpen = ref(false)

function closeNavbar() {
  isNavbarOpen.value = false
}

function toggleNavbar() {
  isNavbarOpen.value = !isNavbarOpen.value
}
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg app-navbar sticky-top">
      <div class="container">
        <RouterLink class="navbar-brand app-brand" :to="appRoutes.inicio" @click="closeNavbar">
          Apps Accesibles
        </RouterLink>

        <button
          class="navbar-toggler app-navbar-toggler"
          type="button"
          :aria-expanded="isNavbarOpen ? 'true' : 'false'"
          aria-controls="main-navbar"
          aria-label="Mostrar navegacion"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="main-navbar" class="collapse navbar-collapse" :class="{ show: isNavbarOpen }">
          <div class="navbar-nav ms-auto">
            <RouterLink
              class="nav-link app-nav-link"
              :to="appRoutes.editorCientifico"
              @click="closeNavbar"
            >
              Editor Cientifico
            </RouterLink>
            <RouterLink class="nav-link app-nav-link" :to="appRoutes.textoBraille" @click="closeNavbar">
              Texto y Braille
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="container py-4 py-md-5">
      <RouterView />
    </main>
  </div>
</template>
