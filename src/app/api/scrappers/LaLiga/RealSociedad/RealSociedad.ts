// Real Sociedad official store (rsstore.realsociedad.eus) — Magento 2.
// Kits at /es/f/equipaciones — products loaded via JS after Cookiebot dismiss.
// Requires Playwright.
import { Product } from '../../shared/Product';
import { launchPlaywright, newStealthContext } from '../../shared/playwrightUtils';

const KITS_URL = 'https://rsstore.realsociedad.eus/es/f/equipaciones';

function parsePrice(raw: string): number {
  const c = raw.replace(/[^\d,.]/, '');
  if (c.includes(',') && !c.includes('.')) return parseFloat(c.replace(',', '.'));
  return parseFloat(c) || 0;
}

export default async function scrapeRealSociedad(): Promise<Product[]> {
  const browser = await launchPlaywright();
  try {
    const context = await newStealthContext(browser);
    const page = await context.newPage();
    await page.goto(KITS_URL, { waitUntil: 'networkidle', timeout: 35000 });

    // Dismiss Cookiebot consent banner
    const cookieBtn = page
      .locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')
      .first();
    if (await cookieBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(800);
    }

    await page.waitForSelector('.product-miniature', { timeout: 15000 });

    const items = await page.$$eval('.product-miniature', (els) =>
      els.map((el) => ({
        name: el.querySelector('.product-title a')?.textContent?.trim() ?? '',
        priceRaw:
          el.querySelector('span.product-price, span.price, .price')?.textContent?.trim() ?? '',
        url: (el.querySelector('.product-title a') as HTMLAnchorElement)?.href ?? '',
      })),
    );

    const products: Product[] = [];
    const seen = new Set<string>();
    for (const item of items) {
      if (!item.name || !item.url || seen.has(item.url)) continue;
      const price = parsePrice(item.priceRaw);
      if (price <= 0) continue;
      seen.add(item.url);
      products.push({ name: item.name, productUrl: item.url, price, currency: 'EUR' });
    }
    return products;
  } catch {
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
