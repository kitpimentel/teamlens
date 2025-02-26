import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto']
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://server:5000',
        changeOrigin: true,
      },
    },
  },
})