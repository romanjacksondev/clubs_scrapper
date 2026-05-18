// AS Monaco official store (shop.asmonaco.com) — Shopify.
// Uses the Shopify /products.json API for the kits collection,
// which contains home, away, and third jerseys.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.asmonaco.com';
const COLLECTION_SLUG = 'kits';

interface ShopifyVariant {
  price: string;
}
interface ShopifyProduct {
  title: string;
  handle: string;
  variants: ShopifyVariant[];
}

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, */*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
};

const scrapeMonaco = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${BASE_URL}/collections/${COLLECTION_SLUG}/products.json?limit=250`, {
      headers: HEADERS,
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (text.trimStart().startsWith('<')) return [];
    const data = JSON.parse(text) as { products: ShopifyProduct[] };
    const seen = new Set<string>();
    return (data.products ?? []).flatMap((p) => {
      const productUrl = `${BASE_URL}/products/${p.handle}`;
      if (seen.has(productUrl)) return [];
      seen.add(productUrl);
      const price = parseFloat(p.variants?.[0]?.price ?? '0');
      return [{ name: p.title, productUrl, price, currency: 'EUR' }];
    });
  } catch {
    return [];
  }
};

export default scrapeMonaco;
