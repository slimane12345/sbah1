import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public',
    // Set to false to prevent Vite from deleting other files in the public directory (like driver.html, etc.)
    emptyOutDir: false, 
  },
  server: {
    // Proxy API requests to the Node server during local development
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
