import { Product } from '../../shared/Product';

// Custom platform (officialstore.it). Products are rendered server-side with
// data-product-* attributes on each product card.
const BASE_URL = 'https://store.atalanta.it';
// Top-level kit category page — lists all current-season kit sub-categories.
const KIT_GARA_URL = `${BASE_URL}/it/kit-gara`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

/**
 * Parse product cards from an Atalanta category page HTML.
 * Each product card has:
 *   class="product-card" data-product-price="CENTS" [data-product-in-promo="1"
 *   data-product-promo-price="CENTS"] ...>
 *     <img alt="PRODUCT NAME" ...>
 *     <a href="https://store.atalanta.it/it/...">
 */
function parseProductCards(html: string): Array<{ name: string; url: string; price: number }> {
  const results: Array<{ name: string; url: string; price: number }> = [];
  // Match each product-card opening div to capture prices in the div attributes.
  const cardRe =
    /class="product-card"[^>]*data-product-price="(\d+)"(?:[^>]*data-product-in-promo="1"[^>]*data-product-promo-price="(\d+)")?[^>]*>/g;

  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) !== null) {
    const rawPrice = parseInt(m[1], 10);
    const promoPrice = m[2] ? parseInt(m[2], 10) : null;
    const price = (promoPrice ?? rawPrice) / 100;

    // Scan the ~1200 chars following the card opening tag for name and URL.
    const chunk = html.substring(m.index, m.index + 1200);
    const altMatch = chunk.match(/alt="([^"]{3,}?)"/);
    const hrefMatch = chunk.match(/href="(https:\/\/store\.atalanta\.it\/it\/[^"]+)"/);

    if (altMatch && hrefMatch && price > 0) {
      results.push({ name: altMatch[1], url: hrefMatch[1], price });
    }
  }
  return results;
}

export default async function scrapeAtalanta(): Promise<Product[]> {
  try {
    // Step 1: fetch the main kit-gara page to discover current-season sub-categories.
    const indexRes = await fetch(KIT_GARA_URL, { headers: HEADERS });
    if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
    const indexHtml = await indexRes.text();

    // Extract unique sub-category URLs (e.g. /it/kit-gara/kit-gara-home-202526).
    // Exclude /uomo, /bambino, /minikit etc. so we get the parent category pages
    // which list all variants in one place.
    const subCategoryRe =
      /(https:\/\/store\.atalanta\.it\/it\/kit-gara\/kit-gara-[^\/"]+)(?:"|\/)/g;
    const subCategoryUrls = new Set<string>();
    let sm: RegExpExecArray | null;
    while ((sm = subCategoryRe.exec(indexHtml)) !== null) {
      subCategoryUrls.add(sm[1]);
    }

    if (subCategoryUrls.size === 0) return [];

    // Step 2: fetch each sub-category page concurrently and collect product cards.
    const products: Product[] = [];
    const seen = new Set<string>();

    await Promise.all(
      [...subCategoryUrls].map(async (url) => {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return;
        const html = await res.text();
        for (const p of parseProductCards(html)) {
          if (!seen.has(p.url)) {
            seen.add(p.url);
            products.push({
              name: p.name,
              productUrl: p.url,
              price: p.price,
              currency: 'EUR',
            });
          }
        }
      }),
    );

    return products;
  } catch (e) {
    console.error('Error in scrapeAtalanta:', e);
    return [];
  }
}
