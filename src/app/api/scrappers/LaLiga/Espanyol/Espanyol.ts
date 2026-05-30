// RCD Espanyol official store (shop.rcdespanyol.com) — PrestaShop.
// Kit categories: /ca/1950-1-equipacio, /ca/1958-2-equipacio, /ca/1964-3-equipacio-
// Products are server-rendered in the HTML; no JS rendering needed.
import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.rcdespanyol.com';
const CATEGORY_URLS = [
  `${BASE_URL}/ca/1950-1-equipacio`,
  `${BASE_URL}/ca/1958-2-equipacio`,
  `${BASE_URL}/ca/1964-3-equipacio-`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ca,es;q=0.9,en;q=0.8',
};

export default async function scrapeEspanyol(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const catUrl of CATEGORY_URLS) {
    try {
      const res = await fetch(catUrl, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('article.product-miniature').each((_, el) => {
        const titleLink = $(el).find('.product-title a, h2.product-title a, h3.product-title a');
        const name = titleLink.text().trim();
        const rawUrl = titleLink.attr('href') ?? '';
        // Strip fragment (#/color/size) — PrestaShop adds it for preselected variant
        const productUrl = rawUrl.split('#')[0];
        const priceContent = $(el).find('span.product-price').attr('content');
        const price = priceContent ? parseFloat(priceContent) : 0;

        if (!name || !productUrl || price <= 0 || seen.has(productUrl)) return;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'EUR' });
      });
    } catch {
      // skip failed category
    }
  }

  return products;
}
