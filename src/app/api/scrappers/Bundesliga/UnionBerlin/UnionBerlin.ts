// 1. FC Union Berlin official store (fanartikel.union-zeughaus.de) — Shopify.
// Uses Shopify's unauthenticated JSON API: /collections/trikots-co/products.json
// No Puppeteer needed — server-rendered JSON response.

import { Product } from '../../shared/Product';

const STORE_BASE = 'https://fanartikel.union-zeughaus.de';
const COLLECTION = 'trikots-co';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

const scrapeUnionBerlin = async (): Promise<Product[]> => {
  const products: Product[] = [];
  let page = 1;

  try {
    while (true) {
      const url = `${STORE_BASE}/collections/${COLLECTION}/products.json?limit=250&page=${page}`;
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;

      const data = await res.json();
      const items: any[] = data.products ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        const name: string = item.title ?? '';
        const price = parseFloat(item.variants?.[0]?.price ?? '0');
        if (!name || price <= 0) continue;
        const productUrl = `${STORE_BASE}/products/${item.handle}`;
        products.push({ name, productUrl, price, currency: 'EUR' });
      }

      if (items.length < 250) break;
      page++;
    }
  } catch (e) {
    console.error('Error in scrapeUnionBerlin:', e);
  }

  return products;
};

export default scrapeUnionBerlin;
