import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// Fix: Import fileURLToPath to construct `__dirname` in an ES module context.
import { fileURLToPath } from 'url';

// Fix: Define `__dirname` for an ES module environment.
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // FIX: Cast `process` to `any` to resolve TypeScript error about missing `argv` property.
  // This is a workaround for an environment where Node.js types might not be fully available.
  const isDriverBuild = (process as any).argv.includes('--outDir') && (process as any).argv.includes('dist-driver');

  return {
    plugins: [react()],
    build: {
      outDir: isDriverBuild ? 'dist-driver' : 'dist',
      rollupOptions: {
        input: isDriverBuild
          ? {
              driver: resolve(__dirname, 'driver.html'),
            }
          : {
              main: resolve(__dirname, 'index.html'),
              customer: resolve(__dirname, 'customer.html'),
              driver: resolve(__dirname, 'driver.html'),
            },
      },
    },
    server: {
      // Proxy API requests to the Node server during local development
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  };
});
