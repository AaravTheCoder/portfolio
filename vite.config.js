import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import base44 from '@base44/vite-plugin'
import { fileURLToPath } from 'url' // Required for aliases

export default defineConfig({
  logLevel: 'error',
  plugins: [
    base44({
      legacySDKImports: true, // Set to true to help with the ZIP export structure
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  resolve: {
    alias: {
      // This allows the code to find files starting with @/
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});