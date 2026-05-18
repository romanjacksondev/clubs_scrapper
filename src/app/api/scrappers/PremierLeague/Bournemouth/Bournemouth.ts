import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE_URL = 'https://superstore.afcb.co.uk';
const KITS_URL = `${BASE_URL}/afc-bournemouth/kit`;

// Bournemouth shop is server-rendered. Each product is in a .ProductCell div:
//   - .productTitle a          → name (text) + href (relative "../../afc-bournemouth/SLUG")
//   - .productPrice .displayPrice → price like "&pound;65.00"

const scrapeBournemouth = async function (): Promise<Product[]> {
  try {
    const res = await fetch(KITS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const seen = new Set<string>();

    $('.ProductCell').each((_i, el) => {
      const anchor = $(el).find('.productTitle a').first();
      const name = anchor.text().trim();
      const rawHref = anchor.attr('href') || '';
      // Resolve relative ../../afc-bournemouth/SLUG against the base URL
      let productUrl: string;
      try {
        productUrl = new URL(rawHref, KITS_URL).href;
      } catch {
        return;
      }
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const priceText = $(el).find('.productPrice .displayPrice').first().text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

      if (name && price) {
        products.push({ name, productUrl, price, currency: 'GBP' });
      }
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeBournemouth:', e);
    return [];
  }
};
export default scrapeBournemouth;
