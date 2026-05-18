// VfL Wolfsburg official store (shop.vfl-wolfsburg.de) — Shopware 6.
// Products are server-rendered in static HTML — no JS rendering needed.
// Card: div.card.product-box, name: a.product-image-link[title], price: span.product-price

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.vfl-wolfsburg.de';

const KIT_PAGES = [
  `${BASE_URL}/trikots-co/spieloutfits/heim/`,
  `${BASE_URL}/trikots-co/spieloutfits/auswaerts/`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export default async function scrapeVfLWolfsburg(): Promise<Product[]> {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const pageUrl of KIT_PAGES) {
    try {
      const res = await fetch(pageUrl, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('.product-box').each((_, el) => {
        const link = $(el).find('a.product-image-link');
        const name = link.attr('title')?.trim() || '';
        const href = link.attr('href') || '';
        const productUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

        const priceText = $(el).find('.product-price').first().text();
        const m = priceText.match(/([\d]+,[\d]+)/);
        const price = m ? parseFloat(m[1].replace(',', '.')) : 0;

        if (name && price > 0 && !seen.has(productUrl)) {
          seen.add(productUrl);
          products.push({ name, productUrl, price, currency: 'EUR' });
        }
      });
    } catch (e) {
      console.error(`scrapeVfLWolfsburg error on ${pageUrl}:`, e);
    }
  }

  return products;
}
