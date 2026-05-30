// Rayo Vallecano official store (tiendarayovallecano.es) — PrestaShop.
// Kit category: /10-equipacion-oficial
// Requires Playwright — JS-rendered product miniatures.
import { Product } from '../../shared/Product';
import { launchPlaywright, newStealthContext } from '../../shared/playwrightUtils';

const KITS_URL = 'https://tiendarayovallecano.es/10-equipacion-oficial';

function parsePrice(raw: string): number {
  const c = raw.replace(/[^\d,.]/, '');
  if (c.includes(',') && !c.includes('.')) return parseFloat(c.replace(',', '.'));
  return parseFloat(c) || 0;
}

export default async function scrapeRayoVallecano(): Promise<Product[]> {
  const browser = await launchPlaywright();
  try {
    const context = await newStealthContext(browser);
    const page = await context.newPage();
    await page.goto(KITS_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // wait for product names to appear (lazy-loaded)
    await page.waitForFunction(
      () => document.querySelector('article.ajax_block_product h3 a') !== null,
      { timeout: 15000 },
    );

    const items = await page.$$eval('article.ajax_block_product', (els) =>
      els.map((el) => ({
        name: el.querySelector('h3 a, h2 a')?.textContent?.trim() ?? '',
        priceRaw: el.querySelector('.price')?.textContent?.trim() ?? '',
        url: (el.querySelector('h3 a, h2 a') as HTMLAnchorElement)?.href?.replace(/#.*$/, '') ?? '',
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
