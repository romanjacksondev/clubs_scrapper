// FC Twente official store (shop.fctwente.nl) — Shopify.
// The Shopify products.json endpoint returns all products; we filter by
// title keywords to keep only jerseys / match kits.

import { Product } from '../../PremierLeague/Product';

const BASE = 'https://shop.fctwente.nl';

const JERSEY_KEYWORDS = [
  'shirt',
  'tenue',
  'jersey',
  'thuisshirt',
  'uitshirt',
  'wedstrijdshirt',
  'minidress',
  'thuistenue',
  'uittenue',
  'derde',
  'away',
  'home',
  'third',
  'keeper',
  'match',
];

const scrapeFCTwente = async (): Promise<Product[]> => {
  const seen = new Set<string>();
  const allProducts: Product[] = [];
  let page = 1;

  while (true) {
    try {
      const url = `${BASE}/products.json?limit=250&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
        },
      });

      if (!res.ok) {
        console.error(`FCTwente: HTTP ${res.status} on page ${page}`);
        break;
      }

      const data = await res.json();
      const products: any[] = data.products ?? [];
      if (!products.length) break;

      for (const p of products) {
        const title: string = p.title?.trim() ?? '';
        const lower = title.toLowerCase();
        const typeL = (p.product_type ?? '').toLowerCase();

        if (!JERSEY_KEYWORDS.some((k) => lower.includes(k) || typeL.includes(k))) continue;

        const productUrl = `${BASE}/products/${p.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const prices = (p.variants ?? [])
          .map((v: any) => parseFloat(v.price))
          .filter((pr: number) => pr > 0);
        const price = prices.length > 0 ? Math.min(...prices) : NaN;

        if (title && productUrl && price > 0) {
          allProducts.push({ name: title, productUrl, price, currency: 'EUR' });
        }
      }

      if (products.length < 250) break;
      page++;
    } catch (err) {
      console.error(`FCTwente: error on page ${page}:`, err);
      break;
    }
  }

  return allProducts;
};

export default scrapeFCTwente;
