import { test, expect } from '@playwright/test';

/**
 * Header (üst menü) E2E testleri.
 * Theme toggle, dil değiştirici ve logo görünürlüğü.
 */
test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('theme toggle butonu görünür', async ({ page }) => {
    const themeButton = page.getByTestId('theme-toggle');
    await expect(themeButton).toBeVisible({ timeout: 15000 });
  });

  test('dil değiştirici butonu (EN veya TR) görünür', async ({ page }) => {
    const langButton = page.getByTestId('language-switcher');
    await expect(langButton).toBeVisible({ timeout: 8000 });
    await expect(langButton).toHaveText(/EN|TR/);
  });

  test('theme toggle tıklanınca aria-label değişir', async ({ page }) => {
    const themeButton = page.getByTestId('theme-toggle');
    const labelBefore = await themeButton.getAttribute('aria-label');
    await themeButton.click();
    await expect(themeButton).not.toHaveAttribute('aria-label', labelBefore!, { timeout: 10000 });
  });

  test('dil değiştirici tıklanınca buton metni değişir', async ({ page }) => {
    const langButton = page.getByTestId('language-switcher');
    const textBefore = (await langButton.textContent())?.trim();
    await langButton.click();
    await expect(langButton).not.toHaveText(textBefore!, { timeout: 8000 });
  });
});
