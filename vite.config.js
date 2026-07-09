import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages deploys under /<repo-name>/, so base must match the repo name.
// Update 'qualicheck-admin-portal' below to match your actual repository name.
export default defineConfig({
  plugins: [react()],
  base: '/qualicheck-admin-portal/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
