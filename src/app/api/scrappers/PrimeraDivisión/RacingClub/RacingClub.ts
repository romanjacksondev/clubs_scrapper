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
  // Argentine format: period = thousands separator (e.g. "220.000" → 220000)
  if (/^\d+,\d{2}$/.test(raw)) return parseFloat(raw.replace(',', '.'));
  if (/^\d+\.\d{2}$/.test(raw)) return parseFloat(raw);
  return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

export default async function scrapeRacingClub(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const pageUrl of KIT_PAGES) {
    try {
      const res = await fetch(pageUrl, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('article.PRODUCT_BOX').each((_, el) => {
        const $el = $(el);
        if ($el.find('.price_wrapper.nonavailable').length) return;

        const name = $el.find('[itemprop="name"]').first().text().trim();
        const priceText = $el.find('div.price span').first().text().trim();
        const price = parsePrice(priceText);
        const urlPath = $el.find('a.price_wrapper[href]').first().attr('href') ?? '';
        const productUrl = urlPath ? `${BASE_URL}${urlPath}` : '';

        if (!name || price <= 0 || !productUrl || seen.has(productUrl)) return;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'ARS' });
      });
    } catch (e) {
      console.error(`Error scraping Racing Club ${pageUrl}:`, e);
    }
  }

  return products;
}
