/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E konfigürasyonu – Portfolio Angular uygulaması.
 * Uygulama varsayılan olarak port 4600'de çalışır.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:4600',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npx ng serve --port 4600',
    url: 'http://localhost:4600',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
