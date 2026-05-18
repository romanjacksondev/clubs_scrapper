// WooCommerce store (centraltienda.com.ar — Rosario Central).
// Products are in the /categoria-producto/le-coq/ category page.
// Prices use Argentine format: $\u00a0139.900 (period = thousands separator).
// Handles pagination via WooCommerce page-numbers links.

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://centraltienda.com.ar';
const KITS_URL = `${BASE_URL}/categoria-producto/le-coq/`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
};

/**
 * Parse the current price from a WooCommerce product element.
 * Handles Argentine format: $\u00a0139.900 (period as thousands separator).
 * Prefers sale price (inside <ins>) over regular price.
 */
function parseWcPriceARS($el: cheerio.Cheerio<AnyNode>): number {
  const saleBdi = $el.find('ins .woocommerce-Price-amount bdi').first().text();
  const anyBdi = $el.find('.woocommerce-Price-amount bdi').first().text();
  const raw = (saleBdi || anyBdi)
    .replace(/[^0-9,.]/g, '')
    .replace(/\u00a0/g, '')
    .trim();
  if (!raw) return 0;
  // Argentine format: period is thousands separator, no decimal cents shown
  // e.g. "139.900" → 139900, "1.234.567" → 1234567
  // European format with cents would be "1.234,56" → handled below
  if (/^\d+,\d{2}$/.test(raw)) return parseFloat(raw.replace(',', '.'));
  if (/^\d+\.\d{2}$/.test(raw)) return parseFloat(raw);
  return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

export default async function scrapeRosarioCentral(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();
  let page = 1;

  while (true) {
    const url = page === 1 ? KITS_URL : `${KITS_URL}page/${page}/`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('li.product').each((_, el) => {
        const $el = $(el);
        const productUrl =
          $el.find('a.woocommerce-LoopProduct-link').first().attr('href') ||
          $el.find('a').first().attr('href') ||
          '';
        const name = $el.find('.woocommerce-loop-product__title').first().text().trim();
        const price = parseWcPriceARS($el);

        if (!productUrl || !name || price <= 0 || seen.has(productUrl)) return;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'ARS' });
      });

      if (!$('a.next.page-numbers').length) break;
    } catch (e) {
      console.error(`Error scraping Rosario Central page ${page}:`, e);
      break;
    }
    page++;
  }

  return products;
}
