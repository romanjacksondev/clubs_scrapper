// Fanatics Italy platform (bolognafcstore.com) — SSR with React/Next.js.
// Products are listed as full-URL text anchors; the price text follows the title link.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.bolognafcstore.com';
const KITS_URL = `${BASE_URL}/it/kit-gara`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

// Navigation and informational slugs that are not product pages.
const NAV_SLUGS = new Set([
  'kit-gara',
  'abbigliamento',
  'bambino-e-neonato',
  'accessori',
  'idee-regalo',
  'outlet',
  'mid-season-promo',
  'accedi',
  'lacquisto',
  'metodi-di-pagamento',
  'la-spedizione',
  'buoni-regalo-gift-card',
  'tracciamento-ordine',
  'tracciamento-reso',
  'customer-care',
  'registrazione',
  'resi-amp-rimborsi',
  'fanatics-italy-srl',
  'condizioni-generali-di-vendita',
  'privacy',
  'cookie-policy',
  'bologna-fc-store',
  'bologna-store',
  'bologna-pop-up-store',
  'back-to-spring',
]);

/**
 * Extract the current selling price from the HTML chunk following a product anchor.
 *
 * Handles these Fanatics price patterns (after stripping tags):
 *   - Plain price:            "€ 68,00"
 *   - Discounted:             "€ 69,00 Prima era: € 99,00 (-30%)"  → current = first
 *   - Bundle discounted:      "Valore Bundle: € 147,00 (-30%) € 103,00" → current = last
 */
function extractCurrentPrice(chunk: string): number {
  const text = chunk.replace(/<[^>]+>/g, ' ');
  const prices = [...text.matchAll(/€\s*([\d,]+)/g)].map((m) => parseFloat(m[1].replace(',', '.')));
  if (prices.length === 0) return 0;
  if (text.includes('Valore Bundle:') && prices.length >= 2) {
    return prices[prices.length - 1];
  }
  return prices[0];
}

const scrapeBologna = async (): Promise<Product[]> => {
  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const products: Product[] = [];
    const seen = new Set<string>();

    // Match text-only anchors with a first-level /it/ slug (no sub-paths in the href).
    // [^<]{5,120} ensures the content is plain text (no child elements like <img>).
    const anchorRe =
      /href="(https:\/\/www\.bolognafcstore\.com\/it\/([\w-]+))"[^>]*>([^<]{5,120})<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = anchorRe.exec(html)) !== null) {
      const productUrl = m[1];
      const slug = m[2];
      const name = m[3].trim();

      if (NAV_SLUGS.has(slug) || seen.has(productUrl)) continue;
      // Product names start with a capital letter and contain at least one space.
      if (!/^[A-Z]/.test(name) || !name.includes(' ')) continue;

      const chunkStart = m.index + m[0].length;
      const price = extractCurrentPrice(html.substring(chunkStart, chunkStart + 500));
      if (price <= 0) continue;

      seen.add(productUrl);
      products.push({ name, productUrl, price, currency: 'EUR' });
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeBologna:', e);
    return [];
  }
};

export default scrapeBologna;
