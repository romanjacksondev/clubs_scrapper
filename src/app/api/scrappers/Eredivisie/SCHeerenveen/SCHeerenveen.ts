// SC Heerenveen official store (www.feanstoreonline.nl) — custom Umbraco/TRES platform.
// Products are server-rendered on the /shop/wedstrijd page.
// Each product card is a .card element with an <a href="/producten/..."> name
// and a .price-inc price element.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const BASE = 'https://www.feanstoreonline.nl';
const LISTING_URL = `${BASE}/shop/wedstrijd`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9',
  Accept: 'text/html',
};

const scrapeSCHeerenveen = async (): Promise<Product[]> => {
  const products: Product[] = [];
  const seen = new Set<string>();

  try {
    const res = await fetch(LISTING_URL, { headers: HEADERS });
    if (!res.ok) {
      console.error(`SCHeerenveen: HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $('.card').each((_, card) => {
      const anchor = $(card).find('a[href^="/producten/"]').first();
      const href = anchor.attr('href');
      if (!href) return;

      const productUrl = `${BASE}${href}`;
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const name = anchor.text().trim();
      if (!name) return;

      const priceText = $(card).find('.price-inc').first().text().trim();
      // Price format: "€ 79,99"
      const priceMatch = priceText.match(/[\d,.]+/);
      if (!priceMatch) return;
      const price = parseFloat(priceMatch[0].replace(',', '.'));
      if (!price || price <= 0) return;

      products.push({ name, productUrl, price, currency: 'EUR' });
    });
  } catch (err) {
    console.error('SCHeerenveen: error', err);
  }

  return products;
};

export default scrapeSCHeerenveen;
