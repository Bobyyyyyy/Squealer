import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build:{
    manifest: true,
    rollupOptions: {
      input: './src/main.js',
      external: 'img/logo.png'
    },
    outDir:"./",
    assetsDir:"./dist/assets",
    emptyOutDir: false,
  },
  server: {
    port: 5174,
  }
})
