// Werder Bremen official store (shop.werder.de) — BigCommerce with <product-card> web components.
// Jerseys at /trikots.html/ — all product-card attributes (name, url, price) are in static HTML.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const JERSEYS_URL = 'https://shop.werder.de/trikots.html/';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const scrapeWerderBremen = async (): Promise<Product[]> => {
  try {
    const res = await fetch(JERSEYS_URL, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);

    const products: Product[] = [];

    $('product-card').each((_, el) => {
      const name = $(el).attr('name')?.trim() || '';
      const productUrl = $(el).attr('url') || '';
      const rawPrice = $(el).attr('sales-price') || $(el).attr('default-price') || '';
      const price = parseFloat(rawPrice);
      const currency = $(el).attr('currency') || 'EUR';

      if (name && productUrl && price > 0) {
        products.push({ name, productUrl, price, currency });
      }
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeWerderBremen:', e);
    return [];
  }
};

export default scrapeWerderBremen;
