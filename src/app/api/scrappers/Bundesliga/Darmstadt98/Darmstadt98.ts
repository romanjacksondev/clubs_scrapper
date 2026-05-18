// SV Darmstadt 98 official store (shop.sv98.de) — Shopware 6 platform.
// Uses puppeteer to navigate — direct fetch of /Trikots/ returns no content.
// Tries to find jerseys from the homepage or category navigation.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_BASE = 'https://shop.sv98.de';
const JERSEYS_URLS = [
  `${STORE_BASE}/CRAFT/Trikots-Co./`,
  `${STORE_BASE}/Lilien-Kollektion/Maenner/Trikots-Co./`,
  `${STORE_BASE}/Lilien-Kollektion/Frauen/Trikots-Co./`,
  `${STORE_BASE}/Lilien-Kollektion/Kids/Trikots-Co./`,
];

const scrapeDarmstadt98 = async (): Promise<Product[]> => {
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

        const cards = Array.from(document.querySelectorAll<HTMLElement>('.product-box'));
        for (const card of cards) {
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
    console.error('Error in scrapeDarmstadt98:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeDarmstadt98;
