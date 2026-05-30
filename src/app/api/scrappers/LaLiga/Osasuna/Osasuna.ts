// Osasuna official store (tienda.osasuna.es) — Magento 2.
// Kit URLs: /wo/match-day/{home,away,third}-kit.html
// Requires Playwright — headless-browser scraping (JS-rendered product grid).
import { Product } from '../../shared/Product';
import { launchPlaywright, newStealthContext } from '../../shared/playwrightUtils';

const KIT_URLS = [
  'https://tienda.osasuna.es/wo/match-day/home-kit.html',
  'https://tienda.osasuna.es/wo/match-day/away-kit.html',
  'https://tienda.osasuna.es/wo/match-day/third-kit.html',
];

function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[^\d,.]/g, '');
  if (cleaned.includes(',') && !cleaned.includes('.')) return parseFloat(cleaned.replace(',', '.'));
  if (cleaned.includes(',') && cleaned.includes('.'))
    return parseFloat(cleaned.replace('.', '').replace(',', '.'));
  return parseFloat(cleaned) || 0;
}

export default async function scrapeOsasuna(): Promise<Product[]> {
  const browser = await launchPlaywright();
  try {
    const context = await newStealthContext(browser);
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const url of KIT_URLS) {
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForSelector('.product-item', { timeout: 15000 });

        const items = await page.$$eval('.product-item', (els) =>
          els.map((el) => ({
            name:
              el.querySelector('.product-item-name a, .product-item-name')?.textContent?.trim() ??
              '',
            priceRaw: el.querySelector('.price')?.textContent?.trim() ?? '',
            url: (el.querySelector('.product-item-name a') as HTMLAnchorElement)?.href ?? '',
          })),
        );

        for (const item of items) {
          if (!item.name || !item.url || seen.has(item.url)) continue;
          const price = parsePrice(item.priceRaw);
          if (price <= 0) continue;
          seen.add(item.url);
          // Determine currency from raw price string
          const currency = item.priceRaw.includes('$') ? 'USD' : 'EUR';
          products.push({ name: item.name, productUrl: item.url, price, currency });
        }
      } catch {
        // skip this kit URL on error
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
