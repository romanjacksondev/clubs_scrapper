// Werder Bremen official store (shop.werder.de) — BigCommerce with <product-card> web components.
// Jerseys at /trikots.html/ — 12 products rendered via JS-injected custom element attributes.
// Read name, url, and price directly from <product-card> element attributes.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const JERSEYS_URL = 'https://shop.werder.de/trikots.html/';

const scrapeWerderBremen = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    const response = await page.goto(JERSEYS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response || response.status() >= 400) {
      await browser.close();
      return [];
    }

    await new Promise((r) => setTimeout(r, 1000));
    await page.waitForSelector('product-card', { timeout: 8000 }).catch(() => {});

    const products: Product[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('product-card'))
        .map((card) => {
          const name = card.getAttribute('name')?.trim() || '';
          const productUrl = card.getAttribute('url') || '';
          const rawPrice =
            card.getAttribute('sales-price') || card.getAttribute('default-price') || '';
          const price = parseFloat(rawPrice);
          return { name, productUrl, price, currency: 'EUR' };
        })
        .filter((p) => p.name && p.productUrl && p.price > 0);
    });

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeWerderBremen:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeWerderBremen;
