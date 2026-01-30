import { test, expect } from '@playwright/test';

/**
 * Mobil viewport E2E testleri.
 * Menü butonu, mobil menü açılması ve navigasyon.
 */
const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);

test.describe('Mobil navigasyon', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobil menü butonu görünür', async ({ page }) => {
    const menuButton = page.getByRole('button', {
      name: /close menu|open menu/i,
    });
    await expect(menuButton).toBeVisible({ timeout: 8000 });
  });

  test('menü açılınca mobil linkler görünür', async ({ page }) => {
    const menuButton = page.getByRole('button', {
      name: /close menu|open menu/i,
    });
    await menuButton.click();
    await expect(
      page.getByRole('link', { name: /about|hakkımda/i }).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('mobil menüden About sayfasına gidilir', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /close menu|open menu/i });
    await menuButton.click();
    await page.getByRole('link', { name: /about|hakkımda/i }).first().click();
    await expect(page).toHaveURL(pathMatch('/about'));
  });

  test('mobil menüden Contact sayfasına gidilir', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /close menu|open menu/i });
    await menuButton.click();
    await page.getByRole('link', { name: /contact|iletişim/i }).first().click();
    await expect(page).toHaveURL(pathMatch('/contact'));
  });
});
