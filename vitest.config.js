import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Vitest config — unit tests over the pure `src/rules/` layer.
// Reuses the same Vite resolve aliases as the app so `@/rules/...` works in tests.
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
    // src/js/* imports DOM/audio/state and is not unit-testable as-is; keep tests
    // scoped to the pure rules registry unless explicitly opting in.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/rules/**/*.js'],
    },
  },
});
