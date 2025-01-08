import { defineConfig } from 'vitest/config';
import path from "path";

export default defineConfig({
    test: {
      include: ["src/**/*.test.ts"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    }
  })