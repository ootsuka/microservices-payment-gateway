import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false, // Ignore SSL issues
      },
      '/api/transactions': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false, // Ignore SSL issues
      }
    },
  },
})
