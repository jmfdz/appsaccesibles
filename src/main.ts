import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.vue'
import EditorCientifico from './views/EditorCientifico.vue'
import Inicio from './views/Inicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio,
    },
    {
      path: '/editor-cientifico',
      name: 'editor-cientifico',
      component: EditorCientifico,
    },
  ],
})

createApp(App).use(router).mount('#app')
