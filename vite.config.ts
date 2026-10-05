import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' faz o build funcionar em qualquer hospedagem estática
// (raiz do domínio ou subpasta, como no GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
