import { test, expect } from '@playwright/test';
import { gotoWithRetry } from './goto-retry';

/**
 * Sayfa içerik E2E testleri.
 * About, Projects, Blog, Experience, Education, Skills sayfalarında başlık ve ana içerik.
 */
const pathMatch = (path: string) => new RegExp(`\\${path}\\/?$`);

test.describe('About sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/about');
  });

  test('About sayfasında h1 başlık görünür', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1, name: /about|hakkımda/i });
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('About sayfasında intro veya açıklama metni görünür', async ({ page }) => {
    await expect(page.getByText(/software developer|yazılım|web/i).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Projects sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/projects');
  });

  test('Projects sayfasında h1 başlık görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/projects|projeler/i, { timeout: 5000 });
  });

  test('Projects sayfasında arama kutusu veya liste alanı görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByPlaceholder(/search|ara/i)
        .or(page.getByText(/no projects|proje yok/i))
        .or(page.locator('input[type="text"]').first())
    ).toBeVisible({ timeout: 12000 });
  });
});

test.describe('Blog sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/blog');
  });

  test('Blog sayfasında h1 başlık görünür', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1, name: /blog/i });
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('Blog sayfasında arama veya içerik alanı görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const searchOrInput = page.getByPlaceholder(/search|ara/i).or(page.locator('input[type="text"]').first());
    await expect(searchOrInput).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Experience sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/experience');
  });

  test('Experience sayfasında h1 başlık görünür', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1, name: /experience|deneyim/i });
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('Experience sayfası yüklenir ve içerik alanı görünür', async ({ page }) => {
    await expect(page).toHaveURL(pathMatch('/experience'));
    await expect(page.locator('app-root')).toBeVisible();
  });
});

test.describe('Education sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/education');
  });

  test('Education sayfasında h1 başlık görünür', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1, name: /education|eğitim/i });
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('Education sayfası yüklenir', async ({ page }) => {
    await expect(page).toHaveURL(pathMatch('/education'));
    await expect(page.locator('app-root')).toBeVisible();
  });
});

test.describe('Skills sayfası içeriği', () => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, '/skills');
  });

  test('Skills sayfasında h1 başlık görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 12000 });
    await expect(heading).toHaveText(/skills|yetenekler/i);
  });

  test('Skills sayfasında All / Tümü filtresi veya kategori butonları görünür', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const allButton = page.getByRole('button').filter({ hasText: /all|tümü/i });
    await expect(allButton).toBeVisible({ timeout: 12000 });
  });
});
