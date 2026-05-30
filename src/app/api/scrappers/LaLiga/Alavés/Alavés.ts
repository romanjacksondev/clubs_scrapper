// Deportivo Alavés official store (baskoniaalavesstore.com/deportivo-alaves) — Magento 2.
// Kit categories listed under /deportivo-alaves/equipaciones — each season gets sub-categories.
// Requires Playwright — Cookiebot consent + JS-rendered product grid.
import { Product } from '../../shared/Product';
import { launchPlaywright, newStealthContext } from '../../shared/playwrightUtils';

const KITS_URL = 'https://www.baskoniaalavesstore.com/deportivo-alaves/equipaciones';

function parsePrice(raw: string): number {
  const c = raw.replace(/[^\d,.]/, '');
  if (c.includes(',') && !c.includes('.')) return parseFloat(c.replace(',', '.'));
  return parseFloat(c) || 0;
}

export default async function scrapeAlaves(): Promise<Product[]> {
  const browser = await launchPlaywright();
  try {
    const context = await newStealthContext(browser);
    const page = await context.newPage();
    await page.goto(KITS_URL, { waitUntil: 'networkidle', timeout: 35000 });

    // Dismiss Cookiebot
    const cookieBtn = page
      .locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')
      .first();
    if (await cookieBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(800);
    }

    // Find season sub-category links
    const subLinks = await page.$$eval('a[href*="equipacion"]', (as) =>
      [...new Set(as.map((a) => (a as HTMLAnchorElement).href))].filter((h) =>
        /equipaci[oó]n-25|equipaci[oó]n-26|equipaciones\//.test(h),
      ),
    );

    const products: Product[] = [];
    const seen = new Set<string>();

    const urls = subLinks.length > 0 ? subLinks : [KITS_URL];
    for (const url of urls.slice(0, 6)) {
      if (page.url() !== url) {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const cookieBtn2 = page
          .locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')
          .first();
        if (await cookieBtn2.isVisible({ timeout: 2000 }).catch(() => false)) {
          await cookieBtn2.click();
          await page.waitForTimeout(500);
        }
      }

      try {
        await page.waitForSelector('.product-miniature', { timeout: 15000 });
      } catch {
        continue;
      }

      const items = await page.$$eval('.product-miniature', (els) =>
        els.map((el) => ({
          name: el.querySelector('.product-title a')?.textContent?.trim() ?? '',
          priceRaw: el.querySelector('span.price, .price')?.textContent?.trim() ?? '',
          url: (el.querySelector('.product-title a') as HTMLAnchorElement)?.href ?? '',
        })),
      );

      for (const item of items) {
        if (!item.name || !item.url || seen.has(item.url)) continue;
        const price = parsePrice(item.priceRaw);
        if (price <= 0) continue;
        seen.add(item.url);
        products.push({ name: item.name, productUrl: item.url, price, currency: 'EUR' });
      }
    }

    return products;
  } catch {
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
