// PSV Eindhoven official store (psvfanshop.nl) — Shopify.
// The store has an invalid/self-signed TLS certificate; Node's https module
// with rejectUnauthorized: false is used to bypass the certificate error.
// Calls the Shopify /products.json API after discovering the kit collection slug.

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import https from 'https';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://psvfanshop.nl';
const KIT_KEYWORDS = ['wedstrijd', 'shirt', 'tenu', 'kit', 'jersey', 'thuis'];

const TLS_AGENT = new https.Agent({ rejectUnauthorized: false });

const REQ_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
};

function httpsGet(url: string, accept: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { agent: TLS_AGENT, headers: { ...REQ_HEADERS, Accept: accept } },
      (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        res.on('end', () => resolve(body));
      },
    );
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

interface ShopifyVariant {
  price: string;
}
interface ShopifyProduct {
  title: string;
  handle: string;
  variants: ShopifyVariant[];
}

const scrapePSVEindhoven = async (): Promise<Product[]> => {
  try {
    const homeHtml = await httpsGet(
      STORE_BASE,
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    );
    const $ = cheerio.load(homeHtml);
    let collectionSlug = 'all';
    $('nav a, header a').each((_: number, el: AnyNode) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr('href') || '';
      if (KIT_KEYWORDS.some((k) => text.includes(k)) && href.includes('/collections/')) {
        const m = href.match(/\/collections\/([^/?#]+)/);
        if (m) {
          collectionSlug = m[1];
          return false;
        }
      }
    });
    const jsonText = await httpsGet(
      `${STORE_BASE}/collections/${collectionSlug}/products.json?limit=250`,
      'application/json',
    );
    if (jsonText.trimStart().startsWith('<')) return [];
    const data = JSON.parse(jsonText) as { products: ShopifyProduct[] };
    const seen = new Set<string>();
    return (data.products ?? []).flatMap((p) => {
      const productUrl = `${STORE_BASE}/products/${p.handle}`;
      if (seen.has(productUrl)) return [];
      seen.add(productUrl);
      const price = parseFloat(p.variants?.[0]?.price ?? '0');
      if (!p.title || price <= 0) return [];
      return [{ name: p.title, productUrl, price, currency: 'EUR' }];
    });
  } catch {
    return [];
  }
};

export default scrapePSVEindhoven;
