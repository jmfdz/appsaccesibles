<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg app-navbar sticky-top">
      <div class="container">
        <RouterLink class="navbar-brand app-brand" to="/">Apps Accesibles</RouterLink>

        <div class="navbar-nav ms-auto">
          <RouterLink class="nav-link app-nav-link" to="/editor-cientifico">
            Editor Cientifico
          </RouterLink>
        </div>
      </div>
    </nav>

    <main class="container py-4 py-md-5">
      <RouterView />
    </main>
  </div>
</template>
