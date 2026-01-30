import { test, expect } from '@playwright/test';

/**
 * Contact sayfası E2E testleri.
 * Form alanlarının varlığı ve sayfa yüklenmesi.
 */
test.describe('Contact sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('contact sayfası yüklenir', async ({ page }) => {
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('isim, email, konu ve mesaj alanları görünür', async ({ page }) => {
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#subject')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
  });

  test('gönder butonu görünür', async ({ page }) => {
    const submitButton = page.getByRole('button', {
      name: /send|gönder/i,
    });
    await expect(submitButton).toBeVisible();
  });

  test('boş form ile gönder butonu devre dışıdır', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send|gönder/i });
    await expect(submitButton).toBeDisabled();
  });

  test('contact sayfası başlığı görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 12000 });
    await expect(heading).toHaveText(/contact|iletişim/i, { timeout: 5000 });
  });
});
