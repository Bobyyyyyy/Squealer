import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],

  build: {
    outDir: "dist_vue",
    assetsDir:"assets_vue"
  },
  server: {
    port: 5174,
  }
})
