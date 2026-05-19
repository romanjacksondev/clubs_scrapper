// Custom store (locademia.racingclub.com.ar — Racing Club de Avellaneda).
// Products are rendered as <article class="PRODUCT_BOX"> elements with
// schema.org microdata. Scrapes the Nike match and stadium kit pages.
// Price format: Argentine (period = thousands separator, e.g. "220.000").
// Unavailable products have class="price_wrapper nonavailable" — skipped.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://locademia.racingclub.com.ar';
const KIT_PAGES = [`${BASE_URL}/tienda/nike/match`, `${BASE_URL}/tienda/nike/stadium`];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
};

function parsePrice(text: string): number {
  const raw = text.replace(/[^0-9.,]/g, '').trim();
  if (!raw) return 0;
  // "1.234,56" — period thousands, comma decimal
  if (/^\d{1,3}(\.\d{3})+(,\d{2})?$/.test(raw))
    return parseFloat(raw.replace(/\./g, '').replace(',', '.'));
  // "1234,56" — comma decimal only
  if (/^\d+,\d{2}$/.test(raw)) return parseFloat(raw.replace(',', '.'));
  // "1234.56" — period decimal only
  if (/^\d+\.\d{1,2}$/.test(raw)) return parseFloat(raw);
  // "220.000" — period thousands, no decimal (integer)
  if (/^\d+\.\d{3}$/.test(raw)) return parseFloat(raw.replace('.', ''));
  return parseFloat(raw) || 0;
}

export default async function scrapeRacingClub(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const pageUrl of KIT_PAGES) {
    try {
      const res = await fetch(pageUrl, { headers: HEADERS });
      if (!res.ok) {
        errors.push(`${pageUrl} → HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      const $ = cheerio.load(html);

      const boxes = $('article.PRODUCT_BOX');
      console.log(`[RacingClub] ${pageUrl}: ${boxes.length} articles found`);

      boxes.each((_, el) => {
        const $el = $(el);
        if ($el.find('.price_wrapper.nonavailable').length) return;

        const name = $el.find('[itemprop="name"]').first().text().trim();
        const priceText = $el.find('div.price span').first().text().trim();
        const price = parsePrice(priceText);
        const urlPath = $el.find('a.price_wrapper[href]').first().attr('href') ?? '';
        const productUrl = urlPath ? `${BASE_URL}${urlPath}` : '';

        if (!name || !priceText || price <= 0 || !productUrl || seen.has(productUrl)) return;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'ARS' });
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${pageUrl} → ${msg}`);
      console.error(`[RacingClub] fetch error for ${pageUrl}:`, msg);
    }
  }

  if (products.length === 0 && errors.length > 0) {
    throw new Error(`RacingClub: all pages failed — ${errors.join('; ')}`);
  }

  return products;
}
