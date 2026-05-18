// WooCommerce store (store.frosinonecalcio.com) — Italian locale.
// Products span multiple pages; prices use Italian comma-decimal format (€ 60,00).
// Handles pagination via WooCommerce page-numbers links (up to 10 pages).

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.frosinonecalcio.com';
const KITS_URL = `${BASE_URL}/product-category/kit-gara/`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

/**
 * Parse the current price from a WooCommerce product element.
 * Prefers the sale price (inside <ins>) over the regular price.
 * Handles both comma-decimal (€ 60,00) and dot-decimal (€ 60.00) formats.
 */
function parseWcPrice($el: cheerio.Cheerio<AnyNode>): number {
  const saleBdi = $el.find('ins .woocommerce-Price-amount bdi').first().text();
  const anyBdi = $el.find('.woocommerce-Price-amount bdi').first().text();
  const raw = (saleBdi || anyBdi).replace(/[^0-9,.]/g, '').replace(/\u00a0/g, '');
  if (!raw) return 0;
  if (/^\d+,\d{2}$/.test(raw)) return parseFloat(raw.replace(',', '.'));
  if (/^\d+\.\d{2}$/.test(raw)) return parseFloat(raw);
  return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

const scrapeFrosinone = async (): Promise<Product[]> => {
  const products: Product[] = [];
  const seen = new Set<string>();
  let page = 1;

  while (page <= 10) {
    const url = page === 1 ? KITS_URL : `${KITS_URL}page/${page}/`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('li.product').each((_, el) => {
        const $el = $(el);
        const productUrl = $el.find('a.woocommerce-LoopProduct-link').first().attr('href') || '';
        const name = $el.find('.woocommerce-loop-product__title').first().text().trim();
        const price = parseWcPrice($el);

        if (!productUrl || !name || price <= 0 || seen.has(productUrl)) return;
        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'EUR' });
      });

      if (!$('a.next.page-numbers').length && !$('.woocommerce-pagination a.next').length) break;
    } catch (e) {
      console.error(`Error scraping Frosinone page ${page}:`, e);
      break;
    }
    page++;
  }

  return products;
};

export default scrapeFrosinone;
