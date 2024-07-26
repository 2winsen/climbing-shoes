import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import preload from 'vite-plugin-preload';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preload()],
});
