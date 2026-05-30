// Feyenoord official store moved to fanshop.feyenoord.nl (Shopify).
// The old domain (www.feyenoordshop.nl) had TLS issues; the new domain has a
// valid Let's Encrypt cert and an accessible products.json endpoint.
// All products are fetched via /products.json?limit=250&page=N and filtered
// client-side to product_type === 'Shirts'.

import { Product } from '../../shared/Product';

const BASE = 'https://fanshop.feyenoord.nl';
const PAGE_SIZE = 250;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9',
  Accept: 'application/json',
};

interface ShopifyVariant {
  price: string;
}

interface ShopifyProduct {
  title: string;
  handle: string;
  product_type: string;
  variants: ShopifyVariant[];
}

const scrapeFeyenoord = async (): Promise<Product[]> => {
  const products: Product[] = [];
  let page = 1;

  try {
    while (true) {
      const url = `${BASE}/products.json?limit=${PAGE_SIZE}&page=${page}`;
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;
      const json = (await res.json()) as { products: ShopifyProduct[] };
      const batch = json.products ?? [];
      if (batch.length === 0) break;

      for (const p of batch) {
        if (p.product_type !== 'Shirts') continue;
        const price = parseFloat(p.variants?.[0]?.price ?? '0');
        if (!price || price <= 0) continue;
        products.push({
          name: p.title,
          productUrl: `${BASE}/products/${p.handle}`,
          price,
          currency: 'EUR',
        });
      }

      if (batch.length < PAGE_SIZE) break;
      page++;
    }
  } catch (err) {
    console.error('Feyenoord: error', err);
  }

  return products;
};

export default scrapeFeyenoord;
