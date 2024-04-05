import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { BASE_URL } from './src/utils/consts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: BASE_URL,
});
