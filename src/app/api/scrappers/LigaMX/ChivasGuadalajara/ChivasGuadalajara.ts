// Chivas Guadalajara official store (tiendachivas.com.mx) — BigCommerce.
// Scrapes the search results page for "jersey" queries.
// Product data is embedded in <article> elements whose main link carries an
// aria-label with the product name and price.
// Price format: "$4,999.00" or "Antes: $X, Ahora: $Y" for sale items (MXN).

import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.tiendachivas.com.mx';
const SEARCH_URL = `${BASE_URL}/search.php?search_query=jersey`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9',
};

/** Parse price from an aria-label string.
 * For sale items the last "$X.XX" is the discounted price ("Ahora"). */
function parsePrice(label: string): number {
  const matches = [...label.matchAll(/\$([0-9,]+\.[0-9]{2})/g)];
  if (matches.length === 0) return 0;
  return parseFloat(matches[matches.length - 1][1].replace(/,/g, ''));
}

const scrapeChivas = async (): Promise<Product[]> => {
  try {
    const res = await fetch(SEARCH_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();

    const products: Product[] = [];
    const seen = new Set<string>();

    const articleRe = /<article[\s\S]*?<\/article>/g;
    let articleMatch: RegExpExecArray | null;

    while ((articleMatch = articleRe.exec(html)) !== null) {
      const article = articleMatch[0];

      // The first aria-label in the article belongs to the product figure link
      const labelMatch = article.match(/aria-label="([^"]+)"/);
      if (!labelMatch) continue;
      const label = labelMatch[1];

      // Name is the portion before the first comma
      const name = label.split(',')[0].trim();
      if (!name) continue;

      // URL: strip search-result query params
      const urlMatch = article.match(/href="(https?:\/\/(?:www\.)?tiendachivas\.com\.mx\/[^"?]+)/);
      if (!urlMatch) continue;
      const productUrl = urlMatch[1];

      if (seen.has(productUrl)) continue;
      seen.add(productUrl);

      const price = parsePrice(label);
      if (price <= 0) continue;

      products.push({ name, productUrl, price, currency: 'MXN' });
    }

    return products;
  } catch {
    return [];
  }
};

export default scrapeChivas;
