// Ajax official store (www.ajax.nl/shop) — custom Next.js + Umbraco CMS storefront.
// Kit category pages embed product data in __NEXT_DATA__ JSON which is parsed first.
// Falls back to cheerio link extraction if __NEXT_DATA__ yields no products.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://www.ajax.nl';

const KIT_URLS = [
  `${STORE_BASE}/shop/wedstrijd/thuistenue`,
  `${STORE_BASE}/shop/wedstrijd/uittenue`,
  `${STORE_BASE}/shop/wedstrijd/derde-tenue`,
  `${STORE_BASE}/shop/wedstrijd/keeperstenue`,
];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

/** Walk a JSON tree to find product-like objects with a /shop/ url, title, and price */
function extractProducts(obj: unknown, seen: Set<string>): Product[] {
  if (!obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) return obj.flatMap((item) => extractProducts(item, seen));
  const rec = obj as Record<string, unknown>;
  const results: Product[] = [];

  const url = String(rec['url'] ?? rec['href'] ?? rec['slug'] ?? '');
  const title = String(rec['name'] ?? rec['title'] ?? '');
  const priceRaw = rec['price'] ?? rec['priceFrom'] ?? rec['regularPrice'];
  if (title && priceRaw != null && url && url.match(/\/shop\/[^/]+\/[^/]+/)) {
    const productUrl = url.startsWith('http') ? url : `${STORE_BASE}${url}`;
    if (!seen.has(productUrl)) {
      seen.add(productUrl);
      const price =
        typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw).replace(',', '.'));
      if (title.length >= 3 && price > 0) {
        results.push({ name: title, productUrl, price, currency: 'EUR' });
      }
    }
  }

  for (const val of Object.values(rec)) {
    results.push(...extractProducts(val, seen));
  }
  return results;
}

const scrapeAjax = async (): Promise<Product[]> => {
  const seen = new Set<string>();
  const allProducts: Product[] = [];

  for (const url of KIT_URLS) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      // Try __NEXT_DATA__ first
      const nextDataRaw = $('script#__NEXT_DATA__').html();
      if (nextDataRaw) {
        try {
          const found = extractProducts(JSON.parse(nextDataRaw) as unknown, seen);
          allProducts.push(...found);
          if (found.length > 0) continue;
        } catch {
          // fall through to HTML parsing
        }
      }

      // HTML fallback: product links match /shop/[category]/[product]
      $('a[href*="/shop/"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (!href.match(/\/shop\/[^/]+\/[^/]+/)) return;
        const productUrl = href.startsWith('http') ? href : `${STORE_BASE}${href}`;
        if (seen.has(productUrl)) return;
        seen.add(productUrl);

        let name = $(el).find('img[alt]').first().attr('alt')?.trim() || '';
        if (!name) name = $(el).find('h2, h3, h4').first().text().trim();
        if (!name) name = $(el).text().trim();
        if (!name || name.length < 3) return;

        const priceMatch = $(el)
          .parent()
          .text()
          .match(/€\s*([\d]+[.,][\d]+)/);
        if (!priceMatch) return;
        const price = parseFloat(priceMatch[1].replace(',', '.'));
        if (price <= 0) return;

        allProducts.push({ name, productUrl, price, currency: 'EUR' });
      });
    } catch {
      // skip this URL
    }
  }
  return allProducts;
};

export default scrapeAjax;
