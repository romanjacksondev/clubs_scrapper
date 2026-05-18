// Borussia Mönchengladbach official store (shop.borussia.de) — Scayle platform (SSR with JS hydration).
// Jerseys category: /de-de/trikots — products rendered as anchor elements with /de-de/p/ paths.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const JERSEYS_URL = 'https://shop.borussia.de/de-de/trikots';
const STORE_BASE = 'https://shop.borussia.de';

const scrapeBorussiaMönchengladbach = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    await page.goto(JERSEYS_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Verify we landed on the correct domain
    const finalUrl: string = page.url();
    if (!finalUrl.includes('shop.borussia.de')) {
      await browser.close();
      return [];
    }

    await new Promise((r) => setTimeout(r, 2000));

    await page
      .waitForSelector('a[data-test-id="product-card-product-name"]', { timeout: 10000 })
      .catch(() => {});

    const products: Product[] = await page.evaluate((storeBase: string) => {
      const results: Product[] = [];
      const seen = new Set<string>();

      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[data-test-id="product-card-product-name"]'),
      );

      for (const link of links) {
        const href = link.href;
        if (!href.includes(storeBase) || seen.has(href)) continue;
        seen.add(href);

        const name = (link.getAttribute('aria-label') || link.textContent || '').trim();
        if (!name || name.length < 3) continue;

        // Price is a sibling element within the same parent container
        const priceEl = link.parentElement?.querySelector('[data-test-id="price"]');
        const priceText = priceEl?.textContent || '';
        const priceMatch = priceText.match(/([\d]+,[\d]+)\s*€/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
        if (price <= 0) continue;

        results.push({ name, productUrl: href, price, currency: 'EUR' });
      }
      return results;
    }, STORE_BASE);

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeBorussiaMönchengladbach:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeBorussiaMönchengladbach;
