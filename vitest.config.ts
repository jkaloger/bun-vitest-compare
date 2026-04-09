import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  oxc: { jsx: "automatic" } as any,
  test: {
    environment: "happy-dom",
    include: ["test/**/*.vitest.test.{ts,tsx}"],
    exclude: ["test/e2e/**"],
  },
});
