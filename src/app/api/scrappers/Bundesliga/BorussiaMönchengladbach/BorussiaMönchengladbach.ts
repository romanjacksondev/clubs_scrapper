// Borussia Mönchengladbach official store (shop.borussia.de) — Scayle platform (server-rendered HTML).
// Jerseys category: /de-de/trikots — products in static HTML as anchor elements with /de-de/p/ paths.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const JERSEYS_URL = 'https://shop.borussia.de/de-de/trikots';
const STORE_BASE = 'https://shop.borussia.de';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html',
};

const scrapeBorussiaMönchengladbach = async (): Promise<Product[]> => {
  try {
    const res = await fetch(JERSEYS_URL, { headers: HEADERS });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const seen = new Set<string>();

    $('a[data-test-id="product-card-product-name"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href) return;
      const productUrl = href.startsWith('http') ? href : `${STORE_BASE}${href}`;
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const name =
        $(el).attr('aria-label') ||
        $(el)
          .text()
          .replace(/<!--.*?-->/g, '')
          .trim();
      if (!name || name.length < 3) return;

      const priceText = $(el).parent().find('[data-test-id="price"]').text();
      const priceMatch = priceText.match(/(\d+,\d+)\s*€/);
      const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
      if (price <= 0) return;

      products.push({ name, productUrl, price, currency: 'EUR' });
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeBorussiaMönchengladbach:', e);
    return [];
  }
};

export default scrapeBorussiaMönchengladbach;
