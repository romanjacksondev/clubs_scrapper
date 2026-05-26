import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.villarrealcf.es';
// Shopify store — the 'equipaciones' collection covers home/away/third kits.
const KITS_URL = `${BASE_URL}/collections/equipaciones/products.json?limit=250`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-GB,en;q=0.9',
};

export default async function scrapeVillarreal(): Promise<Product[]> {
  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const product of data.products ?? []) {
      const price = parseFloat(product.variants?.[0]?.price ?? '0');
      if (!product.title || !price) continue;
      const productUrl = `${BASE_URL}/products/${product.handle}`;
      if (seen.has(productUrl)) continue;
      seen.add(productUrl);
      products.push({
        name: product.title as string,
        productUrl,
        price,
        currency: 'EUR',
      });
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeVillarreal:', e);
    return [];
  }
}
