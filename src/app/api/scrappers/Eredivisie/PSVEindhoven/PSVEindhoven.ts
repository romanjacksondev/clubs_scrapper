// PSV Eindhoven official store: www.psvfanstore.nl — Nuxt 2 SSR + ASPOS platform.
// The /wedstrijd category page is server-side rendered and embeds the full product
// list in a __NUXT__ compressed state block that can be safely evaluated with
// Node's vm module to extract product data (name, price, urlSlug).

import { runInNewContext } from 'vm';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://www.psvfanstore.nl';
const LISTING_URL = `${STORE_BASE}/wedstrijd`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

interface AsposPrice {
  inclTax: number;
}

interface AsposProduct {
  name?: string;
  urlSlug?: string;
  price?: AsposPrice;
  originalPrice?: AsposPrice;
}

interface NuxtState {
  $sproductList_result?: {
    products?: AsposProduct[];
  };
}

const scrapePSVEindhoven = async (): Promise<Product[]> => {
  try {
    const res = await fetch(LISTING_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();

    // Extract __NUXT__ block — a compressed Nuxt 2 state function
    const match =
      html.match(/<script>\s*window\.__NUXT__\s*=\s*([\s\S]+?)\s*<\/script>/) ||
      html.match(/__NUXT__\s*=\s*([\s\S]+?)\s*<\/script>/);
    if (!match) return [];

    // Safely evaluate the Nuxt state in an isolated VM context
    const nuxtData = runInNewContext('(' + match[1] + ')', {}) as {
      state?: NuxtState;
    };

    const products: AsposProduct[] = nuxtData?.state?.['$sproductList_result']?.products ?? [];
    const result: Product[] = [];

    for (const p of products) {
      const name = p.name?.trim();
      const urlSlug = p.urlSlug?.trim();
      if (!name || !urlSlug) continue;

      const price = p.price?.inclTax ?? 0;
      if (price <= 0) continue;

      result.push({
        name,
        productUrl: `${STORE_BASE}/product/${urlSlug}`,
        price,
        currency: 'EUR',
      });
    }

    return result;
  } catch {
    return [];
  }
};

export default scrapePSVEindhoven;
