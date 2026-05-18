import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.acmilan.com';
// Shopify store — milan-match-kit covers all match kit products for men/women/kids.
const KITS_URL = `${BASE_URL}/collections/milan-match-kit/products.json?limit=250`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-GB,en;q=0.9',
};

export default async function scrapeACMilan(): Promise<Product[]> {
  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const products: Product[] = [];

    for (const product of data.products ?? []) {
      const price = parseFloat(product.variants?.[0]?.price ?? '0');
      if (!product.title || !price) continue;
      products.push({
        name: product.title as string,
        productUrl: `${BASE_URL}/products/${product.handle}`,
        price,
        currency: 'EUR',
      });
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeACMilan:', e);
    return [];
  }
}
