import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3001",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
  },
});
