// Mainz 05 official store (shop.mainz05.de) — Shopware 6 platform (server-rendered HTML).
// Same structure as Darmstadt 98: product links with title attribute, prices in span[class*="product-price"].

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://shop.mainz05.de';
const JERSEYS_URLS = [
  `${STORE_BASE}/Profis/Trikots-Trainingsware/Trikots-Hosen-Stutzen/`,
  `${STORE_BASE}/Profis/Erwachsene/Trikots-Hosen-Stutzen/`,
  `${STORE_BASE}/Profis/Kinder/Trikots-Hosen-Stutzen/`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html',
};

const scrapeMainz05 = async (): Promise<Product[]> => {
  const allProducts: Product[] = [];
  const seen = new Set<string>();

  for (const url of JERSEYS_URLS) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;

      const html = await res.text();
      const $ = cheerio.load(html);

      $('.product-box').each((_, el) => {
        const link = $(el).find(`a[href^="${STORE_BASE}"][title]`).first();
        const href = link.attr('href') || '';
        const name = link.attr('title') || '';
        if (!href || !name || name.length < 3 || seen.has(href)) return;
        seen.add(href);

        const priceText = $(el).find('[class*="product-price"]').first().text();
        const priceMatch = priceText.match(/(\d+,\d+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
        if (price <= 0) return;

        allProducts.push({ name, productUrl: href, price, currency: 'EUR' });
      });
    } catch (e) {
      console.error(`Error scraping Mainz05 at ${url}:`, e);
    }
  }

  return allProducts;
};

export default scrapeMainz05;
