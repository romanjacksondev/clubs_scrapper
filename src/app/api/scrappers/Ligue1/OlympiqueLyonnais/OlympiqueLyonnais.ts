// Olympique Lyonnais official store (boutique.ol.fr) — custom PrestaShop.
// The store exposes an AJAX endpoint for category pages that returns JSON
// with a `products` array. We fetch home (domicile) and away (exterieur)
// categories and filter to jersey items only (URL path contains '/maillots-').

import { Product } from '../../shared/Product';

const BASE_URL = 'https://boutique.ol.fr';
const CATEGORY_URLS = [
  `${BASE_URL}/fr/1907-domicile?ajax=1`,
  `${BASE_URL}/fr/1908-exterieur?ajax=1`,
];

interface OLProduct {
  name: string;
  price_amount: number;
  canonical_url: string;
}

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, */*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  'X-Requested-With': 'XMLHttpRequest',
};

const scrapeOlympiqueLyonnais = async (): Promise<Product[]> => {
  try {
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const url of CATEGORY_URLS) {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trimStart().startsWith('<')) continue;
      const data = JSON.parse(text) as { products?: OLProduct[] };
      for (const p of data.products ?? []) {
        // Only include jersey items (not shorts, socks, etc.)
        if (!p.canonical_url.includes('/maillots-')) continue;
        if (seen.has(p.canonical_url)) continue;
        seen.add(p.canonical_url);
        products.push({
          name: p.name,
          productUrl: p.canonical_url,
          price: p.price_amount,
          currency: 'EUR',
        });
      }
    }

    return products;
  } catch {
    return [];
  }
};

export default scrapeOlympiqueLyonnais;
