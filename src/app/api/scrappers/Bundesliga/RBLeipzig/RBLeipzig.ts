// RB Leipzig official store (redbullshop.com/de-int/rb-leipzig/) — Red Bull Shop platform.
// Jersey category: /de-int/c/rbl-official-kit-by-puma/
// Card: a[href*="/de-int/p/"], name: <p> inside card, price: div with exact "XX,XX €" text.

import { Product } from '../../PremierLeague/Product';
import { launchBrowser } from '../../PremierLeague/puppeteerUtils';

const STORE_BASE = 'https://www.redbullshop.com';
const JERSEYS_URL = `${STORE_BASE}/de-int/c/rbl-official-kit-by-puma/`;

const scrapeRBLeipzig = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    const response = await page.goto(JERSEYS_URL, { waitUntil: 'networkidle2', timeout: 40000 });
    if (!response || response.status() >= 400) {
      await browser.close();
      return [];
    }

    await page.waitForSelector('a[href*="/de-int/p/"]', { timeout: 10000 }).catch(() => {});

    const products: Product[] = await page.evaluate((storeBase: string) => {
      const results: Product[] = [];
      const seen = new Set<string>();

      const cards = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/de-int/p/"]'),
      );

      for (const card of cards) {
        // Normalise href — strip variant query param
        const href = (storeBase + new URL(card.href).pathname).replace(/\/$/, '');
        if (seen.has(href)) continue;
        seen.add(href);

        // Product name is the <p> element inside the card
        const name = card.querySelector('p')?.textContent?.trim() || '';
        if (!name || name.length < 3) continue;

        // Price: find a child element whose entire text is exactly "XX,XX €"
        let price = 0;
        for (const el of card.querySelectorAll<HTMLElement>('div, span')) {
          const t = el.textContent?.trim() || '';
          const m = t.match(/^(\d+[,.]\d{2})\s*€$/);
          if (m) {
            price = parseFloat(m[1].replace(',', '.'));
            break;
          }
        }
        if (price <= 0) continue;

        results.push({ name, productUrl: href, price, currency: 'EUR' });
      }
      return results;
    }, STORE_BASE);

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapeRBLeipzig:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeRBLeipzig;
