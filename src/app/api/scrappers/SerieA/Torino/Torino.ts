// Torino FC official store (torinofcstore.com) — PrestaShop.
// Product data is embedded in the page as a `wk_category_products` JS variable.
// The kit-gara category page is at /it/18-kit-gara.

import { Product } from '../../shared/Product';

const KITS_URL = 'https://torinofcstore.com/it/18-kit-gara';

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

interface PSProduct {
  name?: string;
  price?: string | number;
  link?: string;
  url?: string;
  id_product?: number;
}

const scrapeTorino = async (): Promise<Product[]> => {
  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();

    const m = html.match(/wk_category_products\s*=\s*(\[[\s\S]*?\]);/);
    if (!m) return [];

    const items = JSON.parse(m[1]) as PSProduct[];
    const seen = new Set<string>();
    return items.flatMap((p) => {
      const name = p.name?.trim() ?? '';
      if (!name) return [];
      const productUrl = (p.link || p.url || '').trim();
      if (!productUrl || seen.has(productUrl)) return [];
      seen.add(productUrl);
      const price =
        typeof p.price === 'number'
          ? p.price
          : parseFloat(String(p.price ?? '0').replace(',', '.'));
      if (price <= 0) return [];
      return [{ name, productUrl, price, currency: 'EUR' }];
    });
  } catch {
    return [];
  }
};

export default scrapeTorino;
