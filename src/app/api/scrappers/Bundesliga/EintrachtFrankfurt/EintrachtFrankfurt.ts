// Eintracht Frankfurt official store (stores.eintracht.de) — Gatsby SPA.
// Products are rendered client-side; requires Puppeteer (fetch returns empty shell).
// Card: a.ef-product-card, name: h5 inside, price: .ef-product__price--new

import { Product } from '../../PremierLeague/Product';
import { launchBrowser } from '../../PremierLeague/puppeteerUtils';

const BASE_URL = 'https://stores.eintracht.de';

const JERSEY_CATEGORIES = [
  `${BASE_URL}/fanshop/adidas/heimtrikot/`,
  `${BASE_URL}/fanshop/adidas/auswaertstrikot/`,
  `${BASE_URL}/fanshop/adidas/ausweichtrikot/`,
];

export default async function scrapeEintrachtFrankfurt(): Promise<Product[]> {
  let browser: any;
  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    const allProducts: Product[] = [];
    const seen = new Set<string>();

    for (const catUrl of JERSEY_CATEGORIES) {
      const response = await page.goto(catUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      if (!response || response.status() >= 400) continue;

      await page.waitForSelector('a.ef-product-card', { timeout: 8000 }).catch(() => {});

      const pageProducts: Product[] = await page.evaluate((baseUrl: string) => {
        const results: Product[] = [];
        const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.ef-product-card'));

        for (const card of cards) {
          const path = card.getAttribute('href') || '';
          const href = path.startsWith('http') ? path : baseUrl + path.replace(/\/$/, '');
          if (!href.includes(baseUrl)) continue;

          const name = card.querySelector('h5')?.textContent?.trim() || '';
          if (!name || name.length < 3) continue;

          const priceText = card.querySelector('.ef-product__price--new')?.textContent || '';
          const priceMatch = priceText.match(/([\d]+[,.][\d]+)/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
          if (price <= 0) continue;

          results.push({ name, productUrl: href, price, currency: 'EUR' });
        }
        return results;
      }, BASE_URL);

      for (const p of pageProducts) {
        if (!seen.has(p.productUrl)) {
          seen.add(p.productUrl);
          allProducts.push(p);
        }
      }
    }

    await browser.close();
    return allProducts;
  } catch (e) {
    console.error('Error in scrapeEintrachtFrankfurt:', e);
    if (browser) await browser.close();
    return [];
  }
}
