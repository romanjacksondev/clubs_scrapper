// RB Leipzig official store (redbullshop.com/de-int/rb-leipzig/) — Red Bull Shop platform (server-rendered HTML).
// Jersey category: /de-int/c/rbl-official-kit-by-puma/
// Card: a[href*="/de-int/p/"], name: <p> inside card, price: div/span with exact "XX,XX €" text.

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://www.redbullshop.com';
const JERSEYS_URL = `${STORE_BASE}/de-int/c/rbl-official-kit-by-puma/`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'de-DE,de;q=0.9',
  Accept: 'text/html',
};

const scrapeRBLeipzig = async (): Promise<Product[]> => {
  try {
    const res = await fetch(JERSEYS_URL, { headers: HEADERS });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const seen = new Set<string>();

    $('a[href*="/de-int/p/"]').each((_, el) => {
      const rawHref = $(el).attr('href') || '';
      if (!rawHref) return;

      // Build absolute URL and strip query params / trailing slash
      const fullHref = rawHref.startsWith('http') ? rawHref : `${STORE_BASE}${rawHref}`;
      let productUrl: string;
      try {
        const u = new URL(fullHref);
        productUrl = `${STORE_BASE}${u.pathname}`.replace(/\/$/, '');
      } catch {
        return;
      }
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const name = $(el).find('p').first().text().trim();
      if (!name || name.length < 3) return;

      // Price: first child div or span whose trimmed text matches "XX,XX €"
      let price = 0;
      $(el)
        .find('div, span')
        .each((__, priceEl) => {
          if (price > 0) return;
          const t = $(priceEl).text().trim();
          const m = t.match(/^(\d+[,.]\d{2})\s*€$/);
          if (m) price = parseFloat(m[1].replace(',', '.'));
        });
      if (price <= 0) return;

      products.push({ name, productUrl, price, currency: 'EUR' });
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeRBLeipzig:', e);
    return [];
  }
};

export default scrapeRBLeipzig;
