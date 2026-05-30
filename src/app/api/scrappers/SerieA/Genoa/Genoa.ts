// WooCommerce store (genoacfc.it) — custom theme using card-product class.
// The top-level kit-gara category page lists sub-category links
// (kit-home, kit-away, kit-third, portiere); products live on those pages.
// Prices use Italian comma-decimal format (e.g. 89,00 €).

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://genoacfc.it';
const KITS_URL = `${BASE_URL}/categoria-prodotto/team/kit-gara/`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

/**
 * Parse price from a WooCommerce product card element.
 * Handles Italian comma-decimal (89,00 €) and dot-decimal (89.00 €) formats.
 */
function parsePrice($el: cheerio.Cheerio<AnyNode>): number {
  const saleBdi = $el.find('ins .woocommerce-Price-amount bdi').first().text();
  const anyBdi = $el.find('.woocommerce-Price-amount bdi').first().text();
  const raw = (saleBdi || anyBdi).replace(/[^0-9,.]/g, '').replace(/\u00a0/g, '');
  if (!raw) return 0;
  if (/^\d+,\d{2}$/.test(raw)) return parseFloat(raw.replace(',', '.'));
  if (/^\d+\.\d{2}$/.test(raw)) return parseFloat(raw);
  return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

const scrapeGenoa = async (): Promise<Product[]> => {
  try {
    // Step 1: find kit sub-category pages
    const indexRes = await fetch(KITS_URL, { headers: HEADERS });
    if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
    const indexHtml = await indexRes.text();

    const subCatRe = /href="(https:\/\/genoacfc\.it\/categoria-prodotto\/team\/kit-gara\/[^"]+)"/g;
    const subCategories = new Set<string>();
    let sm: RegExpExecArray | null;
    while ((sm = subCatRe.exec(indexHtml)) !== null) {
      const u = sm[1];
      // Skip pagination, feed, and the main category URL
      if (/\/page\/|\/feed\//.test(u)) continue;
      subCategories.add(u);
    }

    if (subCategories.size === 0) throw new Error('No sub-categories found');

    // Step 2: scrape each sub-category for products
    const products: Product[] = [];
    const seen = new Set<string>();

    for (const catUrl of subCategories) {
      let page = 1;
      while (true) {
        const url = page === 1 ? catUrl : `${catUrl.replace(/\/$/, '')}/page/${page}/`;
        try {
          const res = await fetch(url, { headers: HEADERS });
          if (!res.ok) break;
          const html = await res.text();
          const $ = cheerio.load(html);

          let found = 0;
          $('li.product').each((_, el) => {
            const $el = $(el);

            // Product URL: first link pointing to genoacfc.it/prodotto/
            const productUrl =
              $el.find('a[href*="genoacfc.it/prodotto/"]').first().attr('href') || '';
            if (!productUrl || seen.has(productUrl)) return;

            // Name: WooCommerce title class, then any heading, then URL slug
            let name =
              $el.find('.woocommerce-loop-product__title').first().text().trim() ||
              $el.find('h2, h3').first().text().trim() ||
              $el.find('.product-title').first().text().trim();

            if (!name) {
              const slug = productUrl.split('/prodotto/')[1]?.replace(/\/$/, '') ?? '';
              name = slug
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            }

            if (!name) return;

            const price = parsePrice($el);
            if (price <= 0) return;

            seen.add(productUrl);
            found++;
            products.push({ name, productUrl, price, currency: 'EUR' });
          });

          // Stop paginating if no products found or no next-page link
          if (found === 0 || !$('a.next.page-numbers').length) break;
        } catch {
          break;
        }
        page++;
      }
    }

    return products;
  } catch (e) {
    console.error('Error in scrapeGenoa:', e);
    return [];
  }
};

export default scrapeGenoa;
