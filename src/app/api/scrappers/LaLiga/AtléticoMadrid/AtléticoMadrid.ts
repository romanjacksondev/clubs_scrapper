import { Product } from '../../shared/Product';

// SFCC-based store (Salesforce Commerce Cloud).
// Category pages contain an `ItemList` LD+JSON block with product URLs.
// Individual product pages contain a `Product` LD+JSON block with name and EUR price.
const BASE_URL = 'https://shop.atleticodemadrid.com';
const CATEGORY_PAGES = ['/en/kits/home', '/en/kits/away'];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

function extractLdJsonBlocks(html: string): unknown[] {
  const results: unknown[] = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      results.push(JSON.parse(m[1]));
    } catch {
      // skip malformed blocks
    }
  }
  return results;
}

export default async function scrapeAtleticoMadrid(): Promise<Product[]> {
  try {
    // Step 1: collect all unique product URLs from category pages.
    const productUrls = new Set<string>();
    await Promise.all(
      CATEGORY_PAGES.map(async (path) => {
        const res = await fetch(BASE_URL + path, { headers: HEADERS });
        if (!res.ok) return;
        const html = await res.text();
        for (const block of extractLdJsonBlocks(html)) {
          const b = block as Record<string, unknown>;
          const items = b.itemListElement;
          if (!Array.isArray(items)) continue;
          for (const item of items) {
            const url = (item as Record<string, unknown>).url as string | undefined;
            if (url) productUrls.add(url);
          }
        }
      }),
    );

    // Step 2: fetch each product page concurrently and extract name + price.
    const products: Product[] = [];
    const seen = new Set<string>();

    await Promise.all(
      [...productUrls].map(async (url) => {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return;
        const html = await res.text();
        for (const block of extractLdJsonBlocks(html)) {
          const b = block as Record<string, unknown>;
          if (b['@type'] !== 'Product' || !b.name || !b.offers) continue;
          const name = b.name as string;
          if (seen.has(name)) continue;
          seen.add(name);
          const offers = b.offers as Record<string, unknown>;
          const price = parseFloat(offers.price as string);
          const currency = (offers.priceCurrency as string) || 'EUR';
          if (price) products.push({ name, productUrl: url, price, currency });
        }
      }),
    );

    return products;
  } catch (e) {
    console.error('Error in scrapeAtleticoMadrid:', e);
    return [];
  }
}
