// Lanús official store: tiendagranate.clublanus.com
// WooCommerce store — products available via /wp-json/wc/store/v1/products.
// Prices are in smallest currency unit (pesos); divide by 100.
// Paginate until fewer than PAGE_SIZE results are returned.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://tiendagranate.clublanus.com';
const API_URL = `${BASE_URL}/wp-json/wc/store/v1/products`;
const PAGE_SIZE = 100;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

export default async function scrapeLanús(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    let page = 1;
    while (true) {
      const res = await fetch(`${API_URL}?per_page=${PAGE_SIZE}&page=${page}`, {
        headers: HEADERS,
      });
      if (!res.ok) break;
      const data: Array<{
        name: string;
        slug: string;
        prices: { price: string };
      }> = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      for (const p of data) {
        const price = parseInt(p.prices?.price ?? '0', 10) / 100;
        if (p.name && price > 0) {
          products.push({
            name: p.name,
            productUrl: `${BASE_URL}/producto/${p.slug}`,
            price,
            currency: 'ARS',
          });
        }
      }

      if (data.length < PAGE_SIZE) break;
      page++;
    }
  } catch (e) {
    console.error('Error scraping Lanús:', e);
  }

  return products;
}
