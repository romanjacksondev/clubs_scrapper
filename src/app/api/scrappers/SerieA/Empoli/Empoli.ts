// Wix store (shop.empolifc.it) — SSR product listing at /match.
// Products use Wix data-hook attributes; prices shown as "Da €X.XX €Y.YY"
// where the first price is the current (from/sale) price.
// Falls back to regex extraction if Wix selectors find nothing.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.empolifc.it';
const KITS_URL = `${BASE_URL}/match`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

/** Extract the current (lowest/sale) price from a price text like "Da €50.00 €100.00". */
function extractPrice(text: string): number {
  const m = text.match(/€\s*([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

const scrapeEmpoli = async (): Promise<Product[]> => {
  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const products: Product[] = [];
    const seen = new Set<string>();

    // Primary: Wix product grid uses data-hook attributes.
    $('[data-hook="product-item-root"]').each((_, el) => {
      const $el = $(el);
      const anchor = $el.find('[data-hook="product-item-container"], a[href*="/store/"]').first();
      const href = anchor.attr('href') || '';
      const productUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

      const name =
        $el.find('[data-hook="product-item-name"]').first().text().trim() ||
        $el.find('h3').first().text().trim();

      const priceText =
        $el.find('[data-hook="product-item-price-to-pay"]').first().text() ||
        $el.find('[data-hook="product-pricing"]').first().text() ||
        $el.find('[class*="price"]').first().text();

      const price = extractPrice(priceText);

      if (!productUrl || !name || price <= 0 || seen.has(productUrl)) return;
      seen.add(productUrl);
      products.push({ name, productUrl, price, currency: 'EUR' });
    });

    // Fallback: regex over raw HTML for /store/ product anchors with text names.
    if (products.length === 0) {
      const anchorRe =
        /href="(https?:\/\/shop\.empolifc\.it\/store\/([\w-]+))"[^>]*>([^<]{5,120})<\/a>/g;
      let m: RegExpExecArray | null;
      while ((m = anchorRe.exec(html)) !== null) {
        const productUrl = m[1];
        const name = m[3].trim();
        if (!name.includes(' ') || seen.has(productUrl)) continue;
        const chunkStart = m.index + m[0].length;
        const price = extractPrice(html.substring(chunkStart, chunkStart + 300));
        if (price <= 0) continue;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'EUR' });
      }
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeEmpoli:', e);
    return [];
  }
};

export default scrapeEmpoli;
