// FC Augsburg official store (shop.fcaugsburg.de) — LMS Sport GmbH platform.
// Jersey category: /fcaugsburg/SynwayWarengruppen/data/shop/9c091dbc-b9eb-4382-a952-002ea86c972e
// Product URLs: /fcaugsburg/fca-*.htm
// Products are listed in <h3> heading elements with an anchor and a price line below.

import * as cheerio from 'cheerio';
import { Product } from '../../PremierLeague/Product';

const BASE_URL = 'https://shop.fcaugsburg.de';
const JERSEYS_URL = `${BASE_URL}/fcaugsburg/SynwayWarengruppen/data/shop/9c091dbc-b9eb-4382-a952-002ea86c972e`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html',
};

export default async function scrapeFCAugsburg(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  try {
    const res = await fetch(JERSEYS_URL, { headers: HEADERS });
    if (!res.ok) {
      console.error(`scrapeFCAugsburg: HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Product name anchors live inside <h3> elements and link to relative .htm paths
    $('h3 a[href$=".htm"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      // Only product pages — relative paths starting with fca-
      if (!href.startsWith('fca-') || seen.has(href)) return;
      seen.add(href);

      const name = $(el).text().trim();
      if (!name) return;

      const productUrl = `${BASE_URL}/fcaugsburg/${href}`;

      // Price appears in the text of h3's next sibling element(s)
      // Format: "nur X,XX € Y,YY €" (sale + original) or just "X,XX €"
      const h3 = $(el).closest('h3');
      const siblingText = h3.next().text() + ' ' + h3.nextAll().first().text();

      const saleMatch = siblingText.match(/nur\s*([\d,]+)/);
      const anyMatch = siblingText.match(/([\d,]+)\s*€/);
      const priceStr = saleMatch ? saleMatch[1] : anyMatch ? anyMatch[1] : '';
      const price = parseFloat(priceStr.replace(',', '.'));

      if (name && price > 0) {
        products.push({ name, productUrl, price, currency: 'EUR' });
      }
    });
  } catch (e) {
    console.error('scrapeFCAugsburg error:', e);
  }

  return products;
}
