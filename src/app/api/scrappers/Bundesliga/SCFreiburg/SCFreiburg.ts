// SC Freiburg official store (shop.scfreiburg.com) — custom SSR platform by 004 GmbH.
// Category 2 = Trikots & Training. Products are server-rendered in anchor elements.
// URL slug is used to derive a clean product name.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.scfreiburg.com';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html',
};

export default async function scrapeSCFreiburg(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 6; page++) {
    try {
      const url =
        page === 1
          ? `${BASE_URL}/Trikots-Training/categories/2?locale=de`
          : `${BASE_URL}/Trikots-Training/categories/2?locale=de&page=${page}`;

      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;

      const html = await res.text();
      const $ = cheerio.load(html);

      let found = 0;

      $('a[href*="/products/"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (!href.includes('/products/') || seen.has(href)) return;
        seen.add(href);
        found++;

        const productUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

        // Derive product name from URL slug (before "/products/")
        let name = '';
        try {
          const pathname = new URL(productUrl).pathname;
          const segments = pathname.split('/').filter(Boolean);
          const prodIdx = segments.indexOf('products');
          const slug = prodIdx > 0 ? segments[prodIdx - 1] : segments[0];
          // Decode URI encoding, replace hyphens with spaces, fix "2526" → "25/26"
          name = decodeURIComponent(slug)
            .replace(/-/g, ' ')
            .replace(/\b(\d{2})(\d{2})\b/g, '$1/$2');
        } catch {
          name = $(el).text().split('(')[0].replace(/\s+/g, ' ').trim();
        }

        // Extract last price (sale price if two prices, otherwise the single price)
        const rawText = $(el).text();
        const priceMatches = [...rawText.matchAll(/€\s*([\d,]+)/g)];
        if (!priceMatches.length) return;
        const lastPriceStr = priceMatches[priceMatches.length - 1][1].replace(',', '.');
        const price = parseFloat(lastPriceStr);

        if (name && price > 0) {
          products.push({ name, productUrl, price, currency: 'EUR' });
        }
      });

      if (found === 0) break;
    } catch (e) {
      console.error(`scrapeSCFreiburg page ${page} error:`, e);
      break;
    }
  }

  return products;
}
