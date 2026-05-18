// Fanatics Italy platform (store.juventus.com) — same SSR platform as Bologna/Fiorentina.
// The /it/kit-gara index page lists sub-category links (including gender sub-pages);
// individual products live on those sub-category pages.
// Prices are in data-product-price / data-product-promo-price (cents).

import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.juventus.com';
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

const scrapeJuventus = async (): Promise<Product[]> => {
  try {
    // Step 1: find sub-category pages from the kit-gara index
    const indexRes = await fetch(KITS_URL, { headers: HEADERS });
    if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
    const indexHtml = await indexRes.text();

    const subCatRe = /href="(https:\/\/store\.juventus\.com\/it\/kit-gara\/[^"]+)"/g;
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

        const cardRe = /<div class="product-card"((?:[^>]|\n)*?)>(.*?)<\/figure>/gs;
        let m: RegExpExecArray | null;
        while ((m = cardRe.exec(html)) !== null) {
          const attrs = m[1];
          const body = m[0];

          const urlMatch = body.match(
            /href="(https:\/\/store\.juventus\.com\/it\/juventus[\w-]+)"/,
          );
          if (!urlMatch) continue;
          const productUrl = urlMatch[1];
          if (seen.has(productUrl)) continue;

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
    console.error('Error in scrapeJuventus:', e);
    return [];
  }
};

export default scrapeJuventus;
