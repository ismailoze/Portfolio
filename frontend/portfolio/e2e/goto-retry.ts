import type { Page } from '@playwright/test';

/**
 * Connection refused ara ara oluştuğu için page.goto'yu retry ile sarmalar.
 * Sunucu geç hazır veya geçici ağ hatası durumunda tekrar dener.
 */
export async function gotoWithRetry(
  page: Page,
  url: string,
  options: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'commit' } = {},
  maxRetries = 6
): Promise<void> {
  const { timeout = 60_000, waitUntil = 'domcontentloaded' } = options;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, { timeout, waitUntil });
      return;
    } catch (e) {
      lastError = e;
      const msg = String((e && typeof e === 'object' && 'message' in e) ? (e as Error).message : e);
      const isConnectionError = /CONNECTION_REFUSED|NS_ERROR_CONNECTION_REFUSED|ECONNREFUSED|refused/i.test(msg);
      if (isConnectionError && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}
