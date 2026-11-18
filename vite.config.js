import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The Spring Boot backend has no CORS configuration, so in development we
// proxy /api/* through Vite. The browser only ever talks to localhost:5173
// (same origin), and Vite forwards the request to the backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: true },
      },
    },
  }
})
