import { test, expect } from '@playwright/test';

/**
 * Routing E2E testleri.
 * Bilinmeyen path ana sayfaya yönlendirilir; proje ve blog detay URL'leri yüklenir.
 */
test.describe('Routing', () => {
  test('bilinmeyen path ana sayfaya yönlendirilir', async ({ page }) => {
    await page.goto('/unknown-page-404');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('var olmayan proje ID ile projects detay sayfası yüklenir', async ({ page }) => {
    await page.goto('/projects/99999');
    await expect(page).toHaveURL(/\/projects\/99999\/?$/);
    await expect(page.locator('app-root')).toBeVisible({ timeout: 8000 });
  });

  test('var olmayan blog slug ile blog detay sayfası yüklenir', async ({ page }) => {
    await page.goto('/blog/non-existent-slug');
    await expect(page).toHaveURL(/\/blog\/non-existent-slug\/?$/);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('app-root')).toBeVisible({ timeout: 15000 });
  });
});
