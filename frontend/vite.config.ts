import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
    open: true,
    host: true,
    cors: true,
  },
  optimizeDeps: {
    include: ['react-markdown', 'remark-gfm'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'mantine': ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
          'markdown': ['react-markdown', 'remark-gfm']
        }
      }
    }
  },
  base: '/carbon-crunch/',
})
