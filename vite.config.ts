import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/appsaccesibles/',
  plugins: [vue()],
}))
