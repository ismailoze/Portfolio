import { test, expect } from '@playwright/test';
import { gotoWithRetry } from './goto-retry';

/**
 * Ana sayfa (home) E2E testleri.
 * Hero bölümü, CTA butonları ve içerik görünürlüğü.
 */
test.describe('Ana sayfa içeriği', () => {
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/');
  });

  test('hero bölümünde h1 başlık görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('View Projects ve Read Blog butonları görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const viewProjects = page.getByRole('link', { name: /view projects|projeleri görüntüle/i });
    const readBlog = page.getByRole('link', { name: /read blog|blogu oku/i });
    await expect(viewProjects).toBeVisible({ timeout: 15000 });
    await expect(readBlog).toBeVisible({ timeout: 15000 });
  });

  test('View Projects butonu projects sayfasına gider', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);
    await page.getByRole('link', { name: /view projects|projeleri görüntüle/i }).click();
    await expect(page).toHaveURL(pathMatch('/projects'), { timeout: 15000 });
  });

  test('Read Blog butonu blog sayfasına gider', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);
    await page.getByRole('link', { name: /read blog|blogu oku/i }).click();
    await expect(page).toHaveURL(pathMatch('/blog'), { timeout: 15000 });
  });

  test('typing-text alanı veya açıklama metni görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const typingOrDescription = page.locator('.typing-text').or(page.getByText(/developer|geliştiriyorum|web/i));
    await expect(typingOrDescription.first()).toBeVisible({ timeout: 15000 });
  });

  test('scroll indicator sayfada vardır', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const scrollIndicator = page.getByTestId('scroll-indicator');
    await expect(scrollIndicator).toBeAttached({ timeout: 15000 });
  });
});
