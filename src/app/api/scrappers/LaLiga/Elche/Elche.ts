import { Product } from '../../shared/Product';

const BASE_URL = 'https://tienda.elchecf.es';
// WooCommerce store — category 'equipaciones' (ID 32) contains all kits.
const PRODUCTS_URL = `${BASE_URL}/wp-json/wc/store/v1/products?per_page=100&category=equipaciones`;

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
}

export default async function scrapeElche(): Promise<Product[]> {
  try {
    const res = await fetch(PRODUCTS_URL, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: WooProduct[] = await res.json();
    const products: Product[] = [];

    for (const item of data ?? []) {
      const price = parseInt(item.prices?.price ?? '0', 10) / 100;
      if (!item.name || !price) continue;
      products.push({
        name: item.name,
        productUrl: item.permalink,
        price,
        currency: item.prices?.currency_code ?? 'EUR',
      });
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeElche:', e);
    return [];
  }
}
