// AC Monza official store (zeroplayer.it) — Shopify multi-brand store.
// Kit items are under the new-maglie-gare-ac-monza collection.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://zeroplayer.it';
const COLLECTION_SLUG = 'new-maglie-gare-ac-monza';

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
  'Accept-Language': 'it-IT,it;q=0.9',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
};

const scrapeMonza = async (): Promise<Product[]> => {
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
      if (!p.title || price <= 0) return [];
      return [{ name: p.title, productUrl, price, currency: 'EUR' }];
    });
  } catch {
    return [];
  }
};

export default scrapeMonza;
