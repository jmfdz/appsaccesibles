<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="container py-4">
        <p class="eyebrow">Apps Accesibles</p>
        <div class="header-row">
          <div>
            <h1>Editor matemático LaTeX</h1>
            <p class="header-copy">
              Primera aplicación: convierte expresiones LaTeX a MathML y muestra
              el resultado en una vista paralela.
            </p>
          </div>
          <nav class="app-nav">
            <RouterLink to="/">Inicio</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="container py-4 py-md-5">
      <RouterView />
    </main>
  </div>
</template>
