// Mainz 05 official store (shop.mainz05.de) — Shopware 6 platform (server-rendered HTML).
// Product name: a[class*="product-name"] text content.
// Price: span.list-price-price (retail) if present, otherwise first product-price match.
// When a member-discounted price (with-list-price) is shown, the original retail price is in .list-price-price.

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
        const link = $(el).find('a[class*="product-name"]').first();
        const href = link.attr('href') || '';
        const name = link.text().replace(/\s+/g, ' ').trim();
        if (!href || !name || name.length < 3) return;

        const productUrl = href.startsWith('http') ? href : `${STORE_BASE}${href}`;
        if (seen.has(productUrl)) return;
        seen.add(productUrl);

        // Prefer the original retail price (.list-price-price) over any member discount price
        const retailPriceText = $(el).find('.list-price-price').first().text();
        const fallbackPriceText = $(el).find('[class*="product-price"]').first().text();
        const priceText = retailPriceText || fallbackPriceText;
        const priceMatch = priceText.match(/(\d+,\d+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
        if (price <= 0) return;

        allProducts.push({ name, productUrl, price, currency: 'EUR' });
      });
    } catch (e) {
      console.error(`Error scraping Mainz05 at ${url}:`, e);
    }
  }

  return allProducts;
};

export default scrapeMainz05;
