// AZ Alkmaar official store (az.nl/webshop) — custom CMS with Playwright rendering.
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://az.nl';

const CATEGORY_URLS = [
  `${STORE_BASE}/webshop/c/wedstrijd/thuistenue`,
  `${STORE_BASE}/webshop/c/wedstrijd/uittenue`,
  `${STORE_BASE}/webshop/c/wedstrijd/derde-tenue`,
  `${STORE_BASE}/webshop/c/wedstrijd/keepertenue`,
];

const parsePrice = (text: string | null | undefined): number | null => {
  if (!text) return null;
  const m = text
    .replace('.', '')
    .replace(',', '.')
    .match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
};

const scrapeAZ = async (): Promise<Product[]> => {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const allProducts: Product[] = [];
  const seen = new Set<string>();

  try {
    for (const categoryUrl of CATEGORY_URLS) {
      const page = await browser.newPage();
      await page.goto(categoryUrl, { waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});

      const cards = await page.evaluate(() => {
        return [...document.querySelectorAll('.product-card')].map((card) => {
          const salePriceEl = card.querySelector('.product-sale-price');
          const basePriceEl = card.querySelector('.product-base-price');
          const link = card.querySelector('a');
          const lines = (card as HTMLElement).innerText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          return {
            name: lines[0] ?? '',
            salePriceText: salePriceEl?.textContent ?? null,
            basePriceText: basePriceEl?.textContent ?? null,
            pathname: (link as HTMLAnchorElement | null)?.pathname ?? '',
          };
        });
      });

      await page.close();

      for (const c of cards) {
        if (!c.name || !c.pathname) continue;
        const productUrl = `${STORE_BASE}${c.pathname}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const price = parsePrice(c.salePriceText) ?? parsePrice(c.basePriceText);
        if (!price || price <= 0) continue;

        allProducts.push({ name: c.name, productUrl, price, currency: 'EUR' });
      }
    }
  } finally {
    await browser.close();
  }

  return allProducts;
};

export default scrapeAZ;
