// Preston North End official store (shop.pnefc.net) — Shopify.
// The '25-26-all-kits' collection covers all current season kits.
import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.pnefc.net';

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

const scrapePrestonNE = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${BASE_URL}/collections/25-26-all-kits/products.json?limit=250`, {
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
      return [{ name: p.title, productUrl, price, currency: 'GBP' }];
    });
  } catch {
    return [];
  }
};

export default scrapePrestonNE;
