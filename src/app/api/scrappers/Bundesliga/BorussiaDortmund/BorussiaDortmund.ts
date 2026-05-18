// Borussia Dortmund official store (shop.bvb.de) — protected by Queue-it.
// If Queue-it virtual waiting room is detected, returns an empty array.
// Otherwise scrapes the /c/trikots jerseys listing page.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_URL = 'https://shop.bvb.de/c/trikots';

const scrapeBorussiaDortmund = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    await page.goto(STORE_URL, { waitUntil: 'networkidle2', timeout: 40000 });

    // Queue-it detection — virtual waiting room
    const finalUrl: string = page.url();
    if (
      finalUrl.includes('queue-it') ||
      finalUrl.includes('queueit') ||
      finalUrl.includes('queue.')
    ) {
      await browser.close();
      return [];
    }

    // Wait for product cards rendered by Next.js/React
    await page
      .waitForSelector('a[data-testid="productcardlink"]', { timeout: 10000 })
      .catch(() => {});

    const products: Product[] = await page.evaluate(() => {
      const BASE = 'https://shop.bvb.de';
      const results: Product[] = [];
      const seen = new Set<string>();

      // BVB uses Next.js — each product has two productcardlink anchors:
      // 1) an image-only link and 2) a text+price link (contains "Current Price:")
      // We only process the text+price link to avoid the image link stealing the slot.
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[data-testid="productcardlink"]'),
      );

      for (const a of links) {
        const text = a.textContent || '';
        if (!text.includes('Current Price:')) continue; // skip image-only links

        const href = a.getAttribute('href');
        if (!href || !href.startsWith('/product/')) continue;
        const productUrl = BASE + href;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const name = a.getAttribute('aria-label') || '';
        if (!name) continue;

        const priceMatch = text.match(/Current Price:\s*([\d,.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
        if (price <= 0) continue;

        results.push({ name, productUrl, price, currency: 'EUR' });
      }
      return results;
    });

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeBorussiaDortmund:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeBorussiaDortmund;
