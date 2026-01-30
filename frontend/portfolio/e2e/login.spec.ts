import { test, expect } from '@playwright/test';

/**
 * Sunucu hazır olana kadar /login'e gitmeyi dener (connection refused için retry).
 */
async function gotoLogin(page: import('@playwright/test').Page, maxRetries = 6): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto('/login', { timeout: 60_000, waitUntil: 'domcontentloaded' });
      return;
    } catch (e) {
      lastError = e;
      const msg = String((e && typeof e === 'object' && 'message' in e) ? (e as Error).message : e);
      const isConnectionError =
        /CONNECTION_REFUSED|NS_ERROR_CONNECTION_REFUSED|ECONNREFUSED|refused/i.test(msg);
      if (isConnectionError && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

/**
 * Login sayfası E2E testleri.
 * Form görünürlüğü ve validasyon; gerçek API çağrısı yapılmaz.
 * Ara sıra connection refused için suite seviyesinde retry.
 */
test.describe('Login sayfası', () => {
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    await gotoLogin(page);
  });

  test('login sayfası yüklenir', async ({ page }) => {
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('email ve şifre alanları görünür', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password|şifre/i)).toBeVisible();
  });

  test('submit butonu görünür', async ({ page }) => {
    const submitButton = page.locator('form button[type="submit"]');
    await expect(submitButton).toBeVisible({ timeout: 8000 });
  });

  test('boş form ile submit butonu devre dışıdır', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /login|giriş/i });
    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(/\/login/);
  });

  test('geçersiz email ile validasyon mesajı görünür', async ({ page }) => {
    await page.locator('#email').fill('invalid-email');
    await page.locator('#password').fill('somepassword');
    await page.locator('#email').blur();
    await expect(page.locator('.form-error').or(page.getByText(/invalid|geçerli|valid|e-posta/i))).toBeVisible({ timeout: 8000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('login sayfasında h1 başlık görünür', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1, name: /login|giriş/i });
    await expect(heading).toBeVisible();
  });

  test('kısa şifre ile submit butonu devre dışı kalır', async ({ page }) => {
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('12345');
    await page.locator('#email').click();
    const submitButton = page.locator('form button[type="submit"]');
    await expect(submitButton).toBeDisabled({ timeout: 5000 });
  });
});
