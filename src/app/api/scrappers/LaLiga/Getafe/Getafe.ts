// Getafe official store (tienda.getafecf.com) — Magento 1.x.
// Kit categories: /1-equipacion.html, /2-equipacion.html, /3-equipacion.html
// Requires Playwright — product grid rendered by Magento 1 JS framework.
import { Product } from '../../shared/Product';
import { launchPlaywright, newStealthContext } from '../../shared/playwrightUtils';

const BASE = 'https://tienda.getafecf.com';
const KIT_URLS = [
  `${BASE}/index.php/ropa-oficial/equipaciones-oficiales/1-equipacion.html`,
  `${BASE}/index.php/ropa-oficial/equipaciones-oficiales/2-equipacion.html`,
  `${BASE}/index.php/ropa-oficial/equipaciones-oficiales/3-equipacion.html`,
];

function parsePrice(raw: string): number {
  const c = raw.replace(/[^\d,.]/, '');
  if (c.includes(',') && !c.includes('.')) return parseFloat(c.replace(',', '.'));
  return parseFloat(c) || 0;
}

export default async function scrapeGetafe(): Promise<Product[]> {
  const browser = await launchPlaywright();
  try {
    const context = await newStealthContext(browser);
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const url of KIT_URLS) {
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 35000 });
        await page.waitForSelector('.products-grid', { timeout: 15000 });

        const items = await page.$$eval('li.item', (els) =>
          els.map((el) => ({
            name: el.querySelector('h2.product-name a, .product-name a')?.textContent?.trim() ?? '',
            priceRaw: el.querySelector('.price')?.textContent?.trim() ?? '',
            url:
              (el.querySelector('h2.product-name a, .product-name a') as HTMLAnchorElement)?.href ??
              '',
          })),
        );

        for (const item of items) {
          if (!item.name || !item.url || seen.has(item.url)) continue;
          const price = parsePrice(item.priceRaw);
          if (price <= 0) continue;
          seen.add(item.url);
          products.push({ name: item.name, productUrl: item.url, price, currency: 'EUR' });
        }
      } catch {
        // skip on error
      } finally {
        await page.close();
      }
    }
    return products;
  } catch {
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
