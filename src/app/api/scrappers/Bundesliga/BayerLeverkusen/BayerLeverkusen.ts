// Bayer 04 Leverkusen official store (www.bayer04.de/de-de/shop/) — protected by Queue-it.
// If Queue-it virtual waiting room or "staytuned" page is detected, returns an empty array.
// Key: all browser.close() calls are fire-and-forget (.catch(() => {})) so the function never
// hangs waiting for the browser to exit after a navigation error.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const JERSEYS_URL = 'https://www.bayer04.de/de-de/shop/trikots/';
const SHOP_URL = 'https://www.bayer04.de/de-de/shop/';

const QUEUEIT_MARKERS = ['queue-it', 'queueit', 'staytuned'];
const isQueueIt = (url: string) => QUEUEIT_MARKERS.some((m) => url.includes(m));

const scrapeBayerLeverkusen = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    // Use domcontentloaded so we can check for the Queue-it redirect immediately
    // (networkidle2 never fires because the staytuned page does continuous XHR polling)
    try {
      await page.goto(JERSEYS_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch {
      // timeout is expected on the staytuned waiting-room page — fall through to URL check
    }

    if (isQueueIt(page.url())) {
      console.warn('scrapeBayerLeverkusen: Queue-it detected at JERSEYS_URL');
      browser.close().catch(() => {});
      return [];
    }

    // If redirected away from bayer04.de, try shop home
    if (!page.url().includes('bayer04.de')) {
      try {
        await page.goto(SHOP_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch {
        // ignore
      }
      if (isQueueIt(page.url())) {
        console.warn('scrapeBayerLeverkusen: Queue-it detected at SHOP_URL');
        browser.close().catch(() => {});
        return [];
      }
    }

    // Wait 2 s — Queue-it JS may trigger a navigation after domcontentloaded
    await new Promise((r) => setTimeout(r, 2000));

    if (isQueueIt(page.url())) {
      console.warn('scrapeBayerLeverkusen: Queue-it detected after 2s wait');
      browser.close().catch(() => {});
      return [];
    }

    // Wait for product cards to render (best-effort — may not appear)
    await page
      .waitForSelector('article, [class*="product-item"], [class*="ProductItem"]', {
        timeout: 8000,
      })
      .catch(() => {});

    // Wrap evaluate in its own try/catch: if Queue-it navigates the page during evaluate,
    // Puppeteer throws "Execution context was destroyed" and awaiting browser.close() can hang.
    let products: Product[] = [];
    try {
      products = await page.evaluate(() => {
        const results: { name: string; productUrl: string; price: number; currency: string }[] = [];
        const seen = new Set<string>();

        const cards = Array.from(
          document.querySelectorAll<HTMLElement>(
            'article, [class*="product-item"], [class*="ProductItem"]',
          ),
        );

        for (const card of cards) {
          const link = card.querySelector<HTMLAnchorElement>('a[href]');
          if (!link) continue;
          const href = link.href;
          if (!href || seen.has(href)) continue;
          seen.add(href);

          const nameEl = card.querySelector('[class*="name"], [class*="title"], h2, h3');
          const name = (nameEl?.textContent || link.textContent || '').trim();
          if (!name) continue;

          const priceEl = card.querySelector('[class*="price"], [class*="Price"]');
          const priceText = priceEl?.textContent || '';
          const priceMatch = priceText.match(/([\d]+[,.][\d]+)/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
          if (price <= 0) continue;

          results.push({ name, productUrl: href, price, currency: 'EUR' });
        }
        return results;
      });
    } catch (evalErr) {
      // "Execution context was destroyed" — Queue-it redirected the page during evaluate
      console.warn(
        'scrapeBayerLeverkusen: page.evaluate failed (likely Queue-it redirect):',
        evalErr,
      );
      browser.close().catch(() => {});
      return [];
    }

    browser.close().catch(() => {});
    return products;
  } catch (e) {
    console.error('Error in scrapeBayerLeverkusen:', e);
    if (browser) browser.close().catch(() => {});
    return [];
  }
};

export default scrapeBayerLeverkusen;
