import { Product } from '../../shared/Product';

const BASE_URL = 'https://botiga.gironafc.cat';
// WooCommerce store — category ID 1971 ("T. 25-26") holds all 25/26 season products.
// The Store API does not support filtering by category ID directly, so we fetch
// all products (paginated) and filter client-side.
const API_URL = `${BASE_URL}/wp-json/wc/store/v1/products?per_page=100`;
const KIT_CATEGORY_ID = 1971; // T. 25-26

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-GB,en;q=0.9',
};

interface WooProduct {
  name: string;
  permalink: string;
  prices: { price: string; currency_code: string };
  categories: { id: number }[];
}

export default async function scrapeGirona(): Promise<Product[]> {
  try {
    const products: Product[] = [];
    const seen = new Set<string>();

    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`${API_URL}&page=${page}`, { headers: HEADERS });
      if (!res.ok) break;

      const data: WooProduct[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      for (const item of data) {
        const inKitCategory = item.categories?.some((c) => c.id === KIT_CATEGORY_ID);
        if (!inKitCategory) continue;
        const price = parseInt(item.prices?.price ?? '0', 10) / 100;
        if (!item.name || !price) continue;
        if (seen.has(item.permalink)) continue;
        seen.add(item.permalink);
        products.push({
          name: item.name,
          productUrl: item.permalink,
          price,
          currency: item.prices?.currency_code ?? 'EUR',
        });
      }

      if (data.length < 100) break; // last page
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeGirona:', e);
    return [];
  }
}
