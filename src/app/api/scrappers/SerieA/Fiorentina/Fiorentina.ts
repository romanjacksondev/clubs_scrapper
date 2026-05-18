// Fanatics Italy platform (fiorentinastore.com) — SSR with React/Next.js.
// The top-level /it/kit-gara page only lists sub-categories; individual products
// live on pages like /it/kit-gara/kit-gara-home-202526.
// Prices are in data-product-price / data-product-promo-price (cents).

import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.fiorentinastore.com';
const KITS_URL = `${BASE_URL}/it/kit-gara`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

/** Extract price in EUR from data-product card attributes (values are in cents). */
function priceFromCard(cardHtml: string): number {
  const inPromo = /data-product-in-promo="1"/.test(cardHtml);
  const promoMatch = cardHtml.match(/data-product-promo-price="(\d+)"/);
  const regularMatch = cardHtml.match(/data-product-price="(\d+)"/);
  const cents = inPromo && promoMatch ? promoMatch[1] : regularMatch?.[1];
  if (!cents || cents === '0') return 0;
  return parseInt(cents, 10) / 100;
}

const scrapeFiorentina = async (): Promise<Product[]> => {
  try {
    // Step 1: find sub-category pages from the kit-gara index
    const indexRes = await fetch(KITS_URL, { headers: HEADERS });
    if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
    const indexHtml = await indexRes.text();

    const subCatRe = /href="(https:\/\/www\.fiorentinastore\.com\/it\/kit-gara\/[\w-]+)"/g;
    const subCategories = new Set<string>();
    let sm: RegExpExecArray | null;
    while ((sm = subCatRe.exec(indexHtml)) !== null) subCategories.add(sm[1]);

    if (subCategories.size === 0) throw new Error('No sub-categories found on kit-gara page');

    // Step 2: scrape each sub-category page for product cards
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const catUrl of subCategories) {
      try {
        const res = await fetch(catUrl, { headers: HEADERS });
        if (!res.ok) continue;
        const html = await res.text();

        // Each product card: <div class="product-card" data-product-price="..." ...>
        const cardRe = /<div class="product-card"((?:[^>]|\n)*?)>(.*?)<\/figure>/gs;
        let m: RegExpExecArray | null;
        while ((m = cardRe.exec(html)) !== null) {
          const attrs = m[1];
          const body = m[0];

          // Product URL from the first <a href="..."> inside the card
          const urlMatch = body.match(
            /href="(https:\/\/www\.fiorentinastore\.com\/it\/fiorentina-[\w-]+)"/,
          );
          if (!urlMatch) continue;
          const productUrl = urlMatch[1];
          if (seen.has(productUrl)) continue;

          // Product name from img alt attribute
          const nameMatch = body.match(/alt="([^"]{5,120})"/);
          if (!nameMatch) continue;
          const name = nameMatch[1].trim();

          const price = priceFromCard(attrs);
          if (price <= 0) continue;

          seen.add(productUrl);
          products.push({ name, productUrl, price, currency: 'EUR' });
        }
      } catch {
        // skip failing sub-category
      }
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeFiorentina:', e);
    return [];
  }
};

export default scrapeFiorentina;
