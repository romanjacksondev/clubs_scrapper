// 1. FC Heidenheim official store (merchandising-onlineshop.com/fcheidenheim) — Shopware platform.
// Protected by Queue-it bot protection; returns [] when queue is active.

import { Product } from '../../PremierLeague/Product';
import { launchBrowser } from '../../PremierLeague/puppeteerUtils';

const STORE_BASE = 'https://www.merchandising-onlineshop.com/fcheidenheim';
const JERSEYS_URLS = [`${STORE_BASE}/trikots.html`, `${STORE_BASE}/`];

const scrapeFCHeidenheim = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    let landed = false;
    for (const url of JERSEYS_URLS) {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
      const status = response?.status() ?? 0;
      if (status < 400) {
        landed = true;
        break;
      }
    }

    if (!landed) {
      await browser.close();
      return [];
    }

    const finalUrl: string = page.url();
    if (
      finalUrl.includes('queue-it') ||
      finalUrl.includes('queueit') ||
      finalUrl.includes('queue.') ||
      finalUrl.includes('captcha')
    ) {
      await browser.close();
      return [];
    }

    // Wait for Magento 2 KnockoutJS to render product cards
    await page.waitForSelector('li.item.product', { timeout: 10000 }).catch(() => {});

    const products: Product[] = await page.evaluate(() => {
      const results: Product[] = [];
      const seen = new Set<string>();

      // Magento 2 product cards: li.item.product
      const cards = Array.from(document.querySelectorAll<HTMLElement>('li.item.product'));

      for (const card of cards) {
        const link = card.querySelector<HTMLAnchorElement>('a.product-item-link');
        if (!link) continue;
        const href = link.href;
        if (!href || seen.has(href)) continue;
        seen.add(href);

        const name = (link.textContent || '').replace(/\s+/g, ' ').trim();
        if (!name || name.length < 3) continue;

        // Magento 2 price: .price-wrapper .price — text like "34,95 EUR"
        const priceEl = card.querySelector<HTMLElement>('.price-wrapper .price, .price');
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
    console.error('Error in scrapeFCHeidenheim:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeFCHeidenheim;
