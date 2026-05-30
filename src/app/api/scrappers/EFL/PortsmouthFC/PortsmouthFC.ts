// Portsmouth FC official store (pompey.clubstore.co.uk) — nopCommerce / custom SPA.
// Products are JS-rendered; Playwright is needed. Category pages:
//   /home-kit-collection, /away-kit-collection, /third-kit-collection, /goalkeeper-kit-collection
// Selectors: .item-box → .product-title a (name + URL) + .price.actual-price (price)
// Price may be a range "£31.45  - £37.95" — take the first (lowest) value.

import { Product } from '../../shared/Product';
import { launchPlaywright } from '../../shared/playwrightUtils';

const BASE = 'https://pompey.clubstore.co.uk';
const CATEGORIES = [
  'home-kit-collection',
  'away-kit-collection',
  'third-kit-collection',
  'goalkeeper-kit-collection',
];

const scrapePortsmouthFC = async (): Promise<Product[]> => {
  const browser = await launchPlaywright();
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-GB',
    viewport: { width: 1280, height: 800 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    const page = await context.newPage();
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const category of CATEGORIES) {
      try {
        await page.goto(`${BASE}/${category}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch {
        /* timeout ok */
      }
      await page.waitForTimeout(4000);

      const hasItems = await page
        .$('.item-box')
        .then((e) => !!e)
        .catch(() => false);
      if (!hasItems) continue;

      const items = await page.$$eval('.item-box', (boxes) =>
        boxes.map((box) => {
          const nameEl = box.querySelector('.product-title a');
          const priceEl = box.querySelector('.price.actual-price');
          const link = box.querySelector('a');
          return {
            name: nameEl?.textContent?.trim() ?? '',
            priceText: priceEl?.textContent?.trim() ?? '',
            productUrl: (link as HTMLAnchorElement)?.href ?? '',
          };
        }),
      );

      for (const item of items) {
        if (!item.name || !item.productUrl || seen.has(item.productUrl)) continue;
        seen.add(item.productUrl);
        // Price may be "£39.95" or "£31.45  - £37.95" — take first match
        const m = item.priceText.match(/£([\d.]+)/);
        const price = m ? parseFloat(m[1]) : 0;
        if (price <= 0) continue;
        products.push({ name: item.name, productUrl: item.productUrl, price, currency: 'GBP' });
      }
    }

    return products;
  } catch (e) {
    console.error('Error in scrapePortsmouthFC:', e);
    return [];
  } finally {
    await browser.close();
  }
};

export default scrapePortsmouthFC;
