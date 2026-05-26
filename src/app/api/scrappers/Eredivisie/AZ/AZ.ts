// AZ Alkmaar official store (azshop.nl) — Shopify.
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://azshop.nl';

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
  Accept: 'application/json',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
};

const scrapeAZ = async (): Promise<Product[]> => {
  try {
    const seen = new Set<string>();
    const allProducts: Product[] = [];
    let page = 1;

    while (true) {
      const res = await fetch(`${STORE_BASE}/products.json?limit=250&page=${page}`, {
        headers: HEADERS,
      });
      if (!res.ok) break;
      const text = await res.text();
      if (text.trimStart().startsWith('<')) break; // bot-protection HTML
      const data = JSON.parse(text) as { products: ShopifyProduct[] };
      const products = data.products ?? [];
      if (!products.length) break;

      for (const p of products) {
        const productUrl = `${STORE_BASE}/products/${p.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);
        const price = parseFloat(p.variants?.[0]?.price ?? '0');
        if (!p.title || price <= 0) continue;
        allProducts.push({ name: p.title, productUrl, price, currency: 'EUR' });
      }

      if (products.length < 250) break;
      page++;
    }

    return allProducts;
  } catch {
    return [];
  }
};
export default scrapeAZ;
