import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.vue'
import LatexEditorView from './views/LatexEditorView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'latex-editor',
      component: LatexEditorView,
    },
  ],
})

createApp(App).use(router).mount('#app')
