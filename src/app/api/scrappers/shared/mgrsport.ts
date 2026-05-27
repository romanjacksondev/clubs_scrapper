/**
 * Scraper helper for clubs hosted on mgrsport.uy (Fenicio eCommerce platform).
 *
 * Products are embedded as HTML-entity-encoded JSON inside the club's category
 * page. A single fetch is sufficient — names and prices are both present in the
 * initial HTML (no JS execution required).
 *
 * The HTML encodes the product data as &quot; entities. After decoding, each
 * size variant appears as:
 *   "url":"https:\/\/…","tieneStock":…},"nomPresentacion":"S","nombre":"Camiseta
 *   ...","nombreCompleto":"…Talle S","precioMonto":2590,...
 *
 * We capture url, nombre (base name), and precioMonto, then deduplicate by
 * nombre to get one entry per distinct product.
 *
 * Currency is UYU (Uruguayan peso).
 */

import { Product } from './Product';

const BASE_URL = 'https://www.mgrsport.uy';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html',
  'Accept-Language': 'es-UY,es;q=0.9',
};

// Matches one size-variant entry: url, base product name, price
const VARIANT_RE =
  /"url":"([^"]+)","tieneStock":[^}]+},"nomPresentacion":"[^"]*","nombre":"([^"]+)","nombreCompleto":"[^"]+","precioMonto":(\d+)/g;

export async function scrapeMgrsportClub(clubSlug: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/${clubSlug}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // Decode HTML entities embedded by Fenicio
  const html = (await res.text()).replace(/&quot;/g, '"').replace(/&amp;/g, '&');

  const seen = new Set<string>();
  const products: Product[] = [];

  for (const m of html.matchAll(VARIANT_RE)) {
    const [, rawUrl, rawName, priceStr] = m;
    if (seen.has(rawName)) continue; // first size = canonical price
    seen.add(rawName);

    // Decode unicode escapes embedded by PHP (e.g. \u00d1 → Ñ)
    const name = rawName.replace(/\\u([\da-fA-F]{4})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    );

    // Unescape forward slashes in the JSON-encoded URL
    const productUrl = rawUrl.replace(/\\\//g, '/');

    products.push({
      name,
      productUrl,
      price: parseInt(priceStr, 10),
      currency: 'UYU',
    });
  }

  return products;
}
