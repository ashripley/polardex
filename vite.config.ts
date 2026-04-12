import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split vendor libraries into their own chunks so they cache across deploys
        // and don't bloat the page-route chunks. Each entry is a stable browser cache key.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion', 'motion/react'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-styled': ['styled-components'],
          'vendor-radix': ['@radix-ui/react-dialog', '@radix-ui/react-navigation-menu', '@radix-ui/react-select'],
          'vendor-icons': ['@tabler/icons-react'],
        },
      },
    },
    // Bumped from the default 500 — the page chunks are appropriately sized;
    // the warning was for the now-split vendors.
    chunkSizeWarningLimit: 700,
  },
})
