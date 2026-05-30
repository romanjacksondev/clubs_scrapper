// Unión (Santa Fe) official store: tiendaunion.com.ar
// Custom PHP platform — products rendered server-side.
// Product structure: <div class="item"><a href="?pagina=producto&id=ID">
//   <h3>NAME</h3><p>$ PRICE</p></a>

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.tiendaunion.com.ar';
const PRODUCTS_URL = `${BASE_URL}/?pagina=productos`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
};

function parsePrice(raw: string): number {
  // Price format: "$ 85.000" or "$ 1.234.567" (Argentine number format)
  const cleaned = raw
    .replace(/[^0-9,.]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export default async function scrapeUnión(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    const res = await fetch(PRODUCTS_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);

    $('.col-item').each((_, el) => {
      const $el = $(el);
      const link = $el.find('a').first();
      const href = link.attr('href') ?? '';
      const name = $el.find('h3').first().text().trim();
      const priceText = $el.find('p').first().text().trim();
      const price = parsePrice(priceText);

      if (name && price > 0 && href.includes('pagina=producto')) {
        const productUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
        products.push({ name, productUrl, price, currency: 'ARS' });
      }
    });
  } catch (e) {
    console.error('Error scraping Unión:', e);
  }

  return products;
}
