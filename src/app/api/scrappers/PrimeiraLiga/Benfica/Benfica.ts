// Custom store embedded in slbenfica.pt (Sitecore-based).
// Products are server-side rendered; each item has data-productid attribute.
// Name: <h3> inside the .price-info <a> element.
// Price: <p class="price"> — Portuguese format: "55,00€" → 55.00 EUR.
// URL: first <a href> in the product card (relative, prepended with base URL).
// Requires full browser headers to bypass bot detection.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.slbenfica.pt';

const CATEGORY_PATHS = [
  '/pt-pt/loja/equipamentos/principal',
  '/pt-pt/loja/equipamentos/alternativo',
];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
};

function parseBenficaPrice(raw: string): number {
  // "55,00€" → 55.00  |  "100,00€" → 100.00
  const cleaned = raw.replace(/€/g, '').replace(/\./g, '').replace(',', '.').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export default async function scrapeBenfica(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const path of CATEGORY_PATHS) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('div[data-productid]').each((_, el) => {
        const $card = $(el);

        let href = $card.find('a').first().attr('href') ?? '';
        if (!href) return;
        if (!href.startsWith('http')) href = `${BASE_URL}${href}`;

        const name = $card.find('.price-info a h3').first().text().trim();
        if (!name) return;

        const priceRaw = $card.find('p.price').first().text().trim();
        const price = parseBenficaPrice(priceRaw);
        if (price <= 0) return;

        if (!seen.has(href)) {
          seen.add(href);
          products.push({ name, productUrl: href, price, currency: 'EUR' });
        }
      });
    } catch (e) {
      console.error('Error scraping Benfica:', e);
    }
  }

  return products;
}
