// Mainz 05 official store (shop.mainz05.de) — Shopware-based platform.
// Some category paths return 500 errors; navigate with stealth and search for jersey links.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_BASE = 'https://shop.mainz05.de';
const JERSEYS_URLS = [
  `${STORE_BASE}/Profis/Trikots-Trainingsware/Trikots-Hosen-Stutzen/`,
  `${STORE_BASE}/Profis/Erwachsene/Trikots-Hosen-Stutzen/`,
  `${STORE_BASE}/Profis/Kinder/Trikots-Hosen-Stutzen/`,
];

const scrapeMainz05 = async (): Promise<Product[]> => {
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

    for (const url of JERSEYS_URLS) {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      if (!response || response.status() >= 400) continue;

      await new Promise((r) => setTimeout(r, 1000));
      await page.waitForSelector('.product-box', { timeout: 8000 }).catch(() => {});

      const pageProducts: Product[] = await page.evaluate((storeBase: string) => {
        const results: Product[] = [];

        for (const card of document.querySelectorAll<HTMLElement>('.product-box')) {
          const link = card.querySelector<HTMLAnchorElement>(
            'a.product-name, a[class*="product-name"]',
          );
          if (!link) continue;
          const href = link.href;
          if (!href || !href.includes(storeBase)) continue;

          const name = link.textContent?.replace(/\s+/g, ' ').trim() || '';
          if (!name || name.length < 3) continue;

          const priceEl = card.querySelector('.product-price-info, [class*="price"]');
          const priceText = priceEl?.textContent || '';
          const priceMatch = priceText.match(/([\d]+,[\d]+)\s*€/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
          if (price <= 0) continue;

          results.push({ name, productUrl: href, price, currency: 'EUR' });
        }
        return results;
      }, STORE_BASE);

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
    console.error('Error in scrapeMainz05:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeMainz05;
