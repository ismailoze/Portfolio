import { test, expect } from '@playwright/test';

/**
 * Admin route guard E2E testleri.
 * Giriş yapmamış kullanıcı /admin'e giderse ana sayfaya (/) yönlendirilir.
 */
test.describe('Admin guard', () => {
  test('giriş yapmamış kullanıcı /admin\'e gidince ana sayfaya yönlendirilir', async ({
    page,
  }) => {
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page).toHaveURL(/\/$/);
  });

  test('giriş yapmamış kullanıcı /admin/dashboard\'a gidince ana sayfaya yönlendirilir', async ({
    page,
  }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page).toHaveURL(/\/$/);
  });

  test('giriş yapmamış kullanıcı /admin/projects\'a gidince ana sayfaya yönlendirilir', async ({
    page,
  }) => {
    await page.goto('/admin/projects');
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page).toHaveURL(/\/$/);
  });
});
