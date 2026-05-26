// Feyenoord official store (www.feyenoordshop.nl).
// The store has an invalid TLS certificate and the Shopify JSON API returns HTML
// (likely Cloudflare). Node's https module with rejectUnauthorized: false is used
// to bypass the certificate error; static HTML is parsed with cheerio.

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import https from 'https';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://www.feyenoordshop.nl';

const TLS_AGENT = new https.Agent({ rejectUnauthorized: false });

const REQ_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function httpsGet(url: string, depth = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent: TLS_AGENT, headers: REQ_HEADERS }, (res) => {
      if (
        depth < 5 &&
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        resolve(httpsGet(res.headers.location, depth + 1));
        return;
      }
      let body = '';
      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

const scrapeFeyenoord = async (): Promise<Product[]> => {
  try {
    const targetUrl = `${STORE_BASE}/collections/all`;
    const collHtml = await httpsGet(targetUrl);
    const $c = cheerio.load(collHtml);
    const seen = new Set<string>();
    const products: Product[] = [];
    $c('a').each((_: number, el: AnyNode) => {
      const href = $c(el).attr('href') || '';
      if (!href.includes('product') || href.includes('?') || href.includes('#')) return;
      const productUrl = href.startsWith('http') ? href : `${STORE_BASE}${href}`;
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      let name = $c(el).find('img[alt]').first().attr('alt')?.trim() || '';
      if (!name) {
        name = $c(el).find('h2, h3, h4, [class*="title"], [class*="name"]').first().text().trim();
      }
      if (!name) name = $c(el).text().trim();
      if (!name || name.length < 3) return;

      const card = $c(el).closest(
        '[class*="product-card"], [class*="product_card"], [class*="product-item"], [class*="ProductCard"]',
      );
      const priceText = (card.length ? card : $c(el).parent()).text();
      const priceMatch = priceText.match(/€\s*([\d]+[.,][\d]+)/);
      if (!priceMatch) return;
      const price = parseFloat(priceMatch[1].replace(',', '.'));
      if (price <= 0) return;

      products.push({ name, productUrl, price, currency: 'EUR' });
    });
    return products;
  } catch {
    return [];
  }
};

export default scrapeFeyenoord;
