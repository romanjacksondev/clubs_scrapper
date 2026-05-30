// Instituto (Córdoba) official store: tiendainstituto.com.ar
// TiendaNube platform — products rendered server-side with data-product-id attributes.
// Category URL: /indumentaria (returns 200 with products).

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.tiendainstituto.com.ar';
const CATEGORY_SLUG = 'indumentaria';

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
};

function parseTiendanubePrice($el: cheerio.Cheerio<AnyNode>): number {
  const variantsAttr = $el.find('[data-variants]').attr('data-variants');
  if (variantsAttr) {
    try {
      const variants = JSON.parse(variantsAttr);
      const n = variants[0]?.price_number;
      if (n && n > 0) return n;
    } catch {}
  }
  const raw = $el.find('[data-product-price]').attr('data-product-price');
  if (raw) {
    const n = parseInt(raw, 10);
    if (n > 0) return n / 100;
  }
  return 0;
}

async function scrapePage(pageUrl: string): Promise<Product[]> {
  const products: Product[] = [];
  const res = await fetch(pageUrl, { headers: HEADERS });
  if (!res.ok) return [];
  const html = await res.text();
  const $ = cheerio.load(html);

  $('[data-product-id]').each((_, el) => {
    const $el = $(el);
    const id = $el.attr('data-product-id')!;
    const name = $el.find(`[data-store="product-item-name-${id}"]`).text().trim();
    const price = parseTiendanubePrice($el);
    let url = $el.find('a').first().attr('href') ?? '';
    if (url && !url.startsWith('http')) url = `${BASE_URL}${url}`;

    if (name && price > 0 && url) {
      products.push({ name, productUrl: url, price, currency: 'ARS' });
    }
  });
  return products;
}

export default async function scrapeInstituto(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    let page = 1;
    while (true) {
      const url =
        page === 1 ? `${BASE_URL}/${CATEGORY_SLUG}` : `${BASE_URL}/${CATEGORY_SLUG}?page=${page}`;
      const pageProducts = await scrapePage(url);
      if (pageProducts.length === 0) break;
      products.push(...pageProducts);
      page++;
    }
  } catch (e) {
    console.error('Error scraping Instituto:', e);
  }

  return products;
}
