import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // FIX: Cast `process` to `any` to resolve TypeScript error "Property 'argv' does not exist on type 'Process'".
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
