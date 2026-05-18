// Bayer 04 Leverkusen official store (www.bayer04.de/de-de/shop/) — protected by Queue-it.
// If Queue-it virtual waiting room or "staytuned" page is detected, returns an empty array.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const SHOP_URL = 'https://www.bayer04.de/de-de/shop/';
const JERSEYS_URL = 'https://www.bayer04.de/de-de/shop/trikots/';

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
    // Wrap in try/catch: the staytuned page can cause a timeout from some IPs;
    // we still need to check the final URL afterward.
    try {
      await page.goto(JERSEYS_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch {
      // timeout is expected on the staytuned waiting-room page — fall through to URL check
    }

    let finalUrl: string = page.url();
    if (
      finalUrl.includes('queue-it') ||
      finalUrl.includes('staytuned') ||
      finalUrl.includes('queueit')
    ) {
      console.warn('scrapeBayerLeverkusen: Queue-it waiting room detected — store is inaccessible');
      await browser.close();
      return [];
    }

    // If redirected away, try shop home
    if (!finalUrl.includes('bayer04.de')) {
      try {
        await page.goto(SHOP_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch {
        // ignore timeout
      }
      finalUrl = page.url();
      if (
        finalUrl.includes('queue-it') ||
        finalUrl.includes('staytuned') ||
        finalUrl.includes('queueit')
      ) {
        console.warn(
          'scrapeBayerLeverkusen: Queue-it waiting room detected — store is inaccessible',
        );
        await browser.close();
        return [];
      }
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Wait for product cards to render
    await page
      .waitForSelector('article, [class*="product-item"], [class*="ProductItem"]', {
        timeout: 8000,
      })
      .catch(() => {});

    const products: Product[] = await page.evaluate(() => {
      const results: Product[] = [];
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

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeBayerLeverkusen:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeBayerLeverkusen;
