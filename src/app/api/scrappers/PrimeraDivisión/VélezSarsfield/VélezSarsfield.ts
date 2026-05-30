// Tiendanube store (tiendavelez.com.ar — Vélez Sarsfield).
// Products are rendered server-side; each item has data-product-id attribute.
// Name: element with data-store="product-item-name-{id}".
// Price: data-variants JSON (price_number field, in ARS) or
//        data-product-price attribute divided by 100.
// URL: first <a> href inside the product container.

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://tiendavelez.com.ar';
const KITS_URL = `${BASE_URL}/productos`;

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

export default async function scrapeVélezSarsfield(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    const res = await fetch(KITS_URL, { headers: HEADERS });
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
  } catch (e) {
    console.error('Error scraping Vélez Sarsfield:', e);
  }

  return products;
}
