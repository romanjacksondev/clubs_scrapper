// VfB Stuttgart official store (shop.vfb.de) — Next.js/Tailwind storefront.
// Jerseys at /en/jerseys-and-training/jerseys — all fit on one page (no query pagination).
// Product cards: each has two <a> links with same href; the image <img alt="..."> holds the name.
// Price: walk up from the image link until €XX.XX is found in innerText.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_BASE = 'https://shop.vfb.de';
const JERSEYS_URL = `${STORE_BASE}/en/jerseys-and-training/jerseys`;

const scrapeVfBStuttgart = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en;q=0.9,de;q=0.8' });

    const response = await page.goto(JERSEYS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response || response.status() >= 400) {
      await browser.close();
      return [];
    }

    await new Promise((r) => setTimeout(r, 1500));
    await page
      .waitForSelector('a[href*="/en/products/"] img[alt]', { timeout: 8000 })
      .catch(() => {});

    const products: Product[] = await page.evaluate((storeBase: string) => {
      const results: Product[] = [];
      const seen = new Set<string>();

      // Each product has an image link whose <img alt> holds the product name.
      const imgLinks = Array.from(
        document.querySelectorAll<HTMLImageElement>('a[href*="/en/products/"] img[alt]'),
      );

      for (const img of imgLinks) {
        const link = img.closest<HTMLAnchorElement>('a[href*="/en/products/"]');
        if (!link) continue;

        const href = link.getAttribute('href') || '';
        const url = href.startsWith('http') ? href : `${storeBase}${href}`;
        if (seen.has(url)) continue;
        seen.add(url);

        const name = img.getAttribute('alt')?.trim() || '';
        if (!name || name.length < 3) continue;

        // Walk up to find the first ancestor whose innerText contains a price (€XX.XX)
        let container: HTMLElement | null = link.parentElement;
        let price = 0;
        for (let i = 0; i < 6; i++) {
          if (!container) break;
          const m = (container.innerText || '').match(/€\s*([\d]+[.,][\d]+)/);
          if (m) {
            price = parseFloat(m[1].replace(',', '.'));
            break;
          }
          container = container.parentElement;
        }
        if (price <= 0) continue;

        results.push({ name, productUrl: url, price, currency: 'EUR' });
      }
      return results;
    }, STORE_BASE);

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeVfBStuttgart:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeVfBStuttgart;
