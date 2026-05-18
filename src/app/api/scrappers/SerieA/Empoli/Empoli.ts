// Wix/webrepository store (shop.empolifc.it) — fully JS-rendered.
// Server-side fetch is blocked (403); Puppeteer with stealth renders the page.
// Product data is loaded client-side via the WebPlatform store framework.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const BASE_URL = 'https://shop.empolifc.it';
const KITS_URL = `${BASE_URL}/match`;

const scrapeEmpoli = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'it-IT,it;q=0.9' });

    const response = await page.goto(KITS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response || response.status() >= 400) {
      await browser.close();
      return [];
    }

    // Wait for at least one product link to appear
    await page
      .waitForSelector('a[href*="/store/"], .product-item a, .product a', { timeout: 15000 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    const products: Product[] = await page.evaluate((baseUrl: string) => {
      const results: Array<{ name: string; price: number; productUrl: string; currency: string }> =
        [];
      const seen = new Set<string>();

      // webrepository stores use a product grid with links to /store/ paths
      const anchors = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/store/"], a[href*="/match/"]'),
      );

      for (const anchor of anchors) {
        const href = anchor.getAttribute('href') || '';
        if (!href || href === '/store/' || href === '/match/') continue;
        const productUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;
        if (seen.has(productUrl)) continue;

        // Find the card container
        const card =
          anchor.closest<HTMLElement>(
            '.product-item, .product-card, [class*="product"], li[class*="product"]',
          ) ?? anchor.parentElement;

        // Name: from img alt, heading, or anchor text
        let name = '';
        const img = anchor.querySelector<HTMLImageElement>('img[alt]');
        if (img) name = img.getAttribute('alt')?.trim() || '';
        if (!name) {
          const heading = card?.querySelector('h2, h3, h4, .product-title, [class*="title"]');
          name = heading?.textContent?.trim() || anchor.textContent?.trim() || '';
        }
        if (!name || name.length < 3) continue;

        // Price: walk up from anchor looking for a price text
        let price = 0;
        let el: HTMLElement | null = card ?? anchor.parentElement;
        for (let i = 0; i < 8; i++) {
          if (!el) break;
          const text = el.innerText || '';
          const m = text.match(/€\s*([\d]+[.,][\d]+)/);
          if (m) {
            price = parseFloat(m[1].replace(',', '.'));
            break;
          }
          el = el.parentElement;
        }
        if (price <= 0) continue;

        seen.add(productUrl);
        results.push({ name, productUrl, price, currency: 'EUR' });
      }
      return results;
    }, BASE_URL);

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeEmpoli:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeEmpoli;
