// Swansea City official store (store.swanseacity.com) — Shopify.
// Separate collections per kit type: home-kit, away, third.
import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.swanseacity.com';
const COLLECTIONS = ['home-kit', 'away', 'third'];

interface ShopifyVariant {
  price: string;
}
interface ShopifyProduct {
  handle: string;
  title: string;
  variants: ShopifyVariant[];
}

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-GB,en;q=0.9',
};

const scrapeSwanseaCity = async (): Promise<Product[]> => {
  try {
    const seen = new Set<string>();
    const results: Product[] = [];
    for (const collection of COLLECTIONS) {
      const res = await fetch(`${BASE_URL}/collections/${collection}/products.json?limit=250`, {
        headers: HEADERS,
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trimStart().startsWith('<')) continue;
      const data = JSON.parse(text) as { products: ShopifyProduct[] };
      for (const p of data.products ?? []) {
        const productUrl = `${BASE_URL}/products/${p.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);
        const price = parseFloat(p.variants?.[0]?.price ?? '0');
        if (!p.title || price <= 0) continue;
        results.push({ name: p.title, productUrl, price, currency: 'GBP' });
      }
    }
    return results;
  } catch {
    return [];
  }
};

export default scrapeSwanseaCity;
