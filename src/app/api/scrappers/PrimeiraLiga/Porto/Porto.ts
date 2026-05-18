// Magento 2 store at store.fcporto.pt.
// Products are server-side rendered; each item is a <li class="item product product-item">.
// Name: first <img class="product-image-photo"> alt attribute (HTML-decoded by cheerio).
// Price: data-price-amount where data-price-type="oldPrice" (public list price in EUR).
// URL: <a class="product-item-photo"> href.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.fcporto.pt';

const CATEGORY_URLS = [
  `${BASE_URL}/pt/equipamentos/equipamento-principal/`,
  `${BASE_URL}/pt/equipamentos/equipamento-alternativo/`,
];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
};

export default async function scrapePorto(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const url of CATEGORY_URLS) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('li.item.product.product-item').each((_, el) => {
        const $item = $(el);

        const productUrl = $item.find('a.product-item-photo').attr('href') ?? '';
        if (!productUrl) return;

        const name = $item.find('img.product-image-photo').first().attr('alt')?.trim() ?? '';
        if (!name) return;

        // Prefer oldPrice (public list price); fall back to first data-price-amount found
        let price = 0;
        $item.find('[data-price-amount]').each((_, priceEl) => {
          const type = $(priceEl).attr('data-price-type');
          if (type === 'oldPrice' && price === 0) {
            price = parseFloat($(priceEl).attr('data-price-amount') ?? '0');
          }
        });
        if (price === 0) {
          const raw = $item.find('[data-price-amount]').first().attr('data-price-amount');
          price = parseFloat(raw ?? '0');
        }
        if (price <= 0) return;

        if (!seen.has(productUrl)) {
          seen.add(productUrl);
          products.push({ name, productUrl, price, currency: 'EUR' });
        }
      });
    } catch (e) {
      console.error('Error scraping Porto:', e);
    }
  }

  return products;
}
