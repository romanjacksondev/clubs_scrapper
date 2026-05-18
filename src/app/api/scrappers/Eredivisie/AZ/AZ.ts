// AZ Alkmaar official store (azshop.nl) — Shopify.
// Fetches the homepage HTML to find the kit collection URL from navigation,
// then calls the Shopify /products.json API endpoint.

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://azshop.nl';
const KIT_KEYWORDS = ['wedstrijd', 'shirt', 'tenu', 'kit', 'jersey', 'thuis'];

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
  Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
};

const scrapeAZ = async (): Promise<Product[]> => {
  try {
    // Discover kit collection URL from homepage navigation
    const homeRes = await fetch(STORE_BASE, { headers: HEADERS });
    if (!homeRes.ok) return [];
    const homeHtml = await homeRes.text();
    const $ = cheerio.load(homeHtml);

    let collectionSlug = 'shirts';
    $('nav a, header a').each((_: number, el: AnyNode) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr('href') || '';
      if (KIT_KEYWORDS.some((k) => text.includes(k)) && href.includes('/collections/')) {
        const m = href.match(/\/collections\/([^/?#]+)/);
        if (m) {
          collectionSlug = m[1];
          return false; // break each
        }
      }
    });

    const jsonRes = await fetch(
      `${STORE_BASE}/collections/${collectionSlug}/products.json?limit=250`,
      { headers: { ...HEADERS, Accept: 'application/json' } },
    );
    if (!jsonRes.ok) return [];
    const text = await jsonRes.text();
    if (text.trimStart().startsWith('<')) return []; // bot-protection HTML
    const data = JSON.parse(text) as { products: ShopifyProduct[] };

    const seen = new Set<string>();
    return (data.products ?? []).flatMap((p) => {
      const productUrl = `${STORE_BASE}/products/${p.handle}`;
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
export default scrapeAZ;
