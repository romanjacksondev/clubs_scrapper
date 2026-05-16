// TSG Hoffenheim official store (shop.tsg-hoffenheim.de) — Angular SPA backed by SAP Commerce Cloud OCC API.
// OCC baseSite: tsgh-store. Category: TSG-Trikotkollektion (24 products, single page).
// Using the OCC REST API directly avoids scraping a JS-rendered SPA.

import { Product } from '../../PremierLeague/Product';

const API_BASE = 'https://prod-api.tsg-hoffenheim.de/occ/v2/tsgh-store';
const STORE_BASE = 'https://shop.tsg-hoffenheim.de';
const CATEGORY = 'TSG-Trikotkollektion';
const PAGE_SIZE = 24;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'application/json',
};

export default async function scrapeTSGHoffenheim(): Promise<Product[]> {
  const products: Product[] = [];
  let currentPage = 0;

  try {
    do {
      const url =
        `${API_BASE}/products/search` +
        `?fields=FULL` +
        `&query=%3Arelevance%3AallCategories%3A${CATEGORY}` +
        `&pageSize=${PAGE_SIZE}` +
        `&currentPage=${currentPage}` +
        `&lang=de&curr=EUR`;

      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;

      const data = await res.json();
      const total: number = data.pagination?.totalResults ?? 0;
      const items: any[] = data.products ?? [];

      for (const item of items) {
        const name: string = item.name ?? '';
        const price: number = item.price?.value ?? 0;
        const path: string = item.url ?? '';
        if (!name || price <= 0) continue;
        const productUrl = path.startsWith('http') ? path : `${STORE_BASE}${path}`;
        products.push({ name, productUrl, price, currency: 'EUR' });
      }

      if (products.length >= total) break;
      currentPage++;
    } while (currentPage < 10);
  } catch (e) {
    console.error('scrapeTSGHoffenheim error:', e);
  }

  return products;
}
