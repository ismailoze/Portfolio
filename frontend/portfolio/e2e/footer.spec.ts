import { test, expect } from '@playwright/test';

/**
 * Footer E2E testleri.
 * Footer görünürlüğü ve Quick Links.
 */
test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('footer görünür', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 8000 });
  });

  test('footer içinde Portfolio veya açıklama metni görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer');
    await expect(footer.getByText(/portfolio|web uygulamaları|projelerimi/i).first()).toBeVisible({ timeout: 12000 });
  });

  test('footer Quick Links: About linki görünür', async ({ page }) => {
    await expect(
      page.locator('footer').getByRole('link', { name: /about|hakkımda/i })
    ).toBeVisible();
  });

  test('footer Quick Links: Projects linki görünür', async ({ page }) => {
    await expect(
      page.locator('footer').getByRole('link', { name: /projects|projeler/i })
    ).toBeVisible();
  });

  test('footer Quick Links: Blog linki görünür', async ({ page }) => {
    await expect(
      page.locator('footer').getByRole('link', { name: /blog/i })
    ).toBeVisible();
  });

  test('footer Quick Links: Contact linki görünür', async ({ page }) => {
    await expect(
      page.locator('footer').getByRole('link', { name: /contact|iletişim/i })
    ).toBeVisible();
  });

  test('footer About linkine tıklanınca about sayfasına gidilir', async ({ page }) => {
    const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);
    await page.locator('footer').getByRole('link', { name: /about|hakkımda/i }).click();
    await expect(page).toHaveURL(pathMatch('/about'));
  });

  test('footer copyright metni görünür', async ({ page }) => {
    const copyrightParagraph = page.locator('footer p').filter({ hasText: /saklıdır/i });
    await expect(copyrightParagraph).toBeVisible({ timeout: 8000 });
  });
});
