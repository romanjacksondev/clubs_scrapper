// Olympique de Marseille official store (boutique.om.fr) — Shopify.
// Uses the Shopify /products.json API for the home (domicile-flocage)
// and away (exterieur-flocage) flocage collections.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://boutique.om.fr';
const COLLECTIONS = ['domicile-flocage', 'exterieur-flocage'];

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

const scrapeMarseille = async (): Promise<Product[]> => {
  try {
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const slug of COLLECTIONS) {
      const res = await fetch(`${BASE_URL}/collections/${slug}/products.json?limit=250`, {
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
        products.push({ name: p.title, productUrl, price, currency: 'EUR' });
      }
    }

    return products;
  } catch {
    return [];
  }
};

export default scrapeMarseille;
