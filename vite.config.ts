import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// Fix: Import fileURLToPath to construct `__dirname` in an ES module context.
import { fileURLToPath } from 'url';

// Fix: Define `__dirname` for an ES module environment.
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Fix: Replaced `process.cwd()`, which caused a TypeScript error, with `__dirname`.
        // This is a robust way to resolve paths relative to the config file's location.
        main: resolve(__dirname, 'index.html'),
        customer: resolve(__dirname, 'customer.html'),
        driver: resolve(__dirname, 'driver.html'),
        customerDashboardAdmin: resolve(__dirname, 'customerDashboardAdmin.html'),
      }
    }
  },
  server: {
    // Proxy API requests to the Node server during local development
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});