import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.vue'
import { appRoutes } from './services/routerPaths'
import EditorCientifico from './views/EditorCientifico.vue'
import Inicio from './views/Inicio.vue'
import TextoBraille from './views/TextoBraille.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: appRoutes.inicio,
      name: 'inicio',
      component: Inicio,
    },
    {
      path: appRoutes.editorCientifico,
      name: 'editor-cientifico',
      component: EditorCientifico,
    },
    {
      path: appRoutes.textoBraille,
      name: 'texto-braille',
      component: TextoBraille,
    },
  ],
})

createApp(App).use(router).mount('#app')
