import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://arsenaldirect.arsenal.com';
const KITS_URL = `${BASE_URL}/Football-Shirts-and-Kit/c/kit?show=All`;

// Product data is server-rendered in the static HTML.
// Each product is wrapped in an <a href="/.../.../p/MJ[ID]"> anchor containing:
//   - .typography--body3  → product name
//   - .typography--body3-bold span (last) → price like "£85.00"

export default async function scrapeArsenal(): Promise<Product[]> {
  try {
    const res = await fetch(KITS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-GB,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const seen = new Set<string>();

    $('a[href*="/p/"]').each((_i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const productUrl = BASE_URL + href;
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const name = $(el).find('.typography--body3').first().text().trim();
      let priceText = $(el).find('.typography--body3-bold span').last().text().trim();
      if (!priceText) priceText = $(el).find('.typography--body3-bold').text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

      if (name && price) {
        products.push({ name, productUrl, price, currency: 'GBP' });
      }
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeArsenal:', e);
    return [];
  }
}
