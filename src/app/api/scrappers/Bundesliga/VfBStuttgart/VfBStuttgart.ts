// VfB Stuttgart official store (shop.vfb.de) — Next.js/Tailwind storefront.
// Jerseys at /en/jerseys-and-training/jerseys — server-rendered HTML (1MB+).
// Product data is embedded in Next.js RSC chunks (self.__next_f.push) as escaped JSON.
// Extract: "isSearchable":true → "name" → "seoCanonical" (/en/...) → "price":{"price":"EUR XX.XX"}

import { Product } from '../../shared/Product';

const STORE_BASE = 'https://shop.vfb.de';
const JERSEYS_URL = `${STORE_BASE}/en/jerseys-and-training/jerseys`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9,de;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const scrapeVfBStuttgart = async (): Promise<Product[]> => {
  try {
    const res = await fetch(JERSEYS_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();

    const products: Product[] = [];
    const seen = new Set<string>();

    // Product data lives in RSC escaped-JSON chunks: \"isSearchable\":true,\"name\":\"...\",
    // ...\"seoCanonical\":\"/en/...\",  ...\"price\":{\"price\":\"EUR XX.XX\"
    const pattern =
      /\\"isSearchable\\":true,\\"name\\":\\"([^\\"]+?)\\".*?\\"seoCanonical\\":\\"(\/en\/[^\\"]+?)\\".*?\\"price\\":\{\\"price\\":\\"EUR ([\d.]+)\\"/gs;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      const [, rawName, slug, priceStr] = match;
      const productUrl = `${STORE_BASE}${slug}`;
      if (seen.has(productUrl)) continue;
      seen.add(productUrl);

      const name = rawName.trim();
      const price = parseFloat(priceStr);
      if (!name || price <= 0) continue;

      products.push({ name, productUrl, price, currency: 'EUR' });
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeVfBStuttgart:', e);
    return [];
  }
};

export default scrapeVfBStuttgart;
