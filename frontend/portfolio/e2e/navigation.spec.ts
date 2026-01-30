import { test, expect } from '@playwright/test';

/**
 * Ana sayfa ve navigasyon E2E testleri.
 * Header'daki data-testid ile dil bağımsız seçim yapılıyor.
 */
test.describe('Navigasyon ve ana sayfa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ana sayfa yüklenir ve başlık görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Portfolio/i);
    await expect(page.locator('app-root')).toBeVisible({ timeout: 10000 });
  });

  test('header içinde ana sayfa linki vardır', async ({ page }) => {
    await expect(page.getByTestId('nav-home')).toBeVisible();
  });

  // Firefox bazen URL'yi sondaki slash ile döndürür; \/? ile her iki biçim kabul edilir.
  const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);

  test('About sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-about').click();
    await expect(page).toHaveURL(pathMatch('/about'));
  });

  test('Projects sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-projects').click();
    await expect(page).toHaveURL(pathMatch('/projects'));
  });

  test('Blog sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-blog').click();
    await expect(page).toHaveURL(pathMatch('/blog'));
  });

  test('Experience sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-experience').click();
    await expect(page).toHaveURL(pathMatch('/experience'));
  });

  test('Education sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-education').click();
    await expect(page).toHaveURL(pathMatch('/education'));
  });

  test('Skills sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-skills').click();
    await expect(page).toHaveURL(pathMatch('/skills'));
  });

  test('Contact sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-contact').click();
    await expect(page).toHaveURL(pathMatch('/contact'));
  });

  test('doğrudan URL ile sayfalara gidilir', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(pathMatch('/about'));

    await page.goto('/contact');
    await expect(page).toHaveURL(pathMatch('/contact'));

    await page.goto('/projects');
    await expect(page).toHaveURL(pathMatch('/projects'));
  });

  test('header Login linkine tıklanınca login sayfasına gidilir', async ({ page }) => {
    await page.getByTestId('nav-login').click();
    await expect(page).toHaveURL(/\/login\/?/);
  });
});
