import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      open: true,
      strictPort: false,
      allowedHosts: [
        '.ngrok-free.app',
        '.ngrok.io',
        '.ngrok.app'
      ]
    },
    // Make sure env variables are properly exposed
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000/api/v1')
    }
  }
})