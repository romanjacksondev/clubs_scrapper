// FC Bayern München official store (fcbayern.com/store) — Scayle platform.
// Jersey categories: de-de locale for EUR pricing. May return 403 from non-EU IPs (Akamai).
// Category path changed from /jerseys-more/ to /trikots-mehr/ in May 2026.
// Uses puppeteer-extra with stealth to handle bot detection.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_BASE = 'https://fcbayern.com/store';
const LOCALE = 'de-de';

const CATEGORIES = [
  `${STORE_BASE}/${LOCALE}/c/adidas/trikots-mehr/home`,
  `${STORE_BASE}/${LOCALE}/c/adidas/trikots-mehr/away`,
  `${STORE_BASE}/${LOCALE}/c/adidas/trikots-mehr/champions-league`,
  `${STORE_BASE}/${LOCALE}/c/adidas/trikots-mehr/torwart`,
];

const scrapeBayernMunich = async (): Promise<Product[]> => {
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

    for (const catUrl of CATEGORIES) {
      const response = await page.goto(catUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      // Skip if geo-blocked or redirected away from the store
      if (!response || response.status() === 403) continue;
      const finalUrl: string = page.url();
      if (!finalUrl.includes('fcbayern.com/store')) continue;

      await new Promise((r) => setTimeout(r, 2000));

      // Wait for Scayle product links to render
      await page.waitForSelector('a[href*="/p/"]', { timeout: 8000 }).catch(() => {});

      const catProducts: Product[] = await page.evaluate((storeBase: string) => {
        const results: Product[] = [];
        // Scayle product links contain /p/ in the path
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/p/"]'));
        for (const link of links) {
          const href = link.href;
          if (!href || !href.includes(storeBase)) continue;

          // Product name from named elements inside the card
          const nameEl =
            link.querySelector('[class*="name"], [class*="title"], h2, h3') ||
            link.closest('[class*="product"]')?.querySelector('[class*="name"], [class*="title"]');
          const name = (nameEl?.textContent || link.textContent || '').trim();
          if (!name || name.length < 3) continue;

          // Price from price element inside or near the card
          const card = link.closest('[class*="product"], article, li') || link.parentElement;
          const priceEl = card?.querySelector('[class*="price"], [class*="Price"]');
          const priceText = priceEl?.textContent || '';
          const priceMatch = priceText.match(/([\d]+[,.][\d]+)/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;

          if (price > 0) {
            results.push({ name, productUrl: href, price, currency: 'EUR' });
          }
        }
        return results;
      }, STORE_BASE);

      for (const p of catProducts) {
        if (!seen.has(p.productUrl)) {
          seen.add(p.productUrl);
          allProducts.push(p);
        }
      }
    }

    await browser.close();
    return allProducts;
  } catch (e) {
    console.error('Error in scrapeBayernMunich:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeBayernMunich;
