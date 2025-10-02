import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/smokesim_website/', // GitHub Pages repository name
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})