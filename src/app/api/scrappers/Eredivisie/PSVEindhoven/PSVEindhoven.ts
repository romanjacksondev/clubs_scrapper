// PSV Eindhoven official store (psvfanshop.nl) — Shopify.
// The store has an invalid/self-signed TLS certificate; Node's https module
// with rejectUnauthorized: false is used to bypass the certificate error.

import https from 'https';
import { Product } from '../../shared/Product';

const STORE_BASE = 'https://psvfanshop.nl';

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
    const allProducts: Product[] = [];
    const seen = new Set<string>();
    let page = 1;

    while (true) {
      const jsonText = await httpsGet(
        `${STORE_BASE}/products.json?limit=250&page=${page}`,
        'application/json',
      );
      if (jsonText.trimStart().startsWith('<')) break;
      const data = JSON.parse(jsonText) as { products: ShopifyProduct[] };
      const products = data.products ?? [];
      if (!products.length) break;

      for (const p of products) {
        const productUrl = `${STORE_BASE}/products/${p.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);
        const price = parseFloat(p.variants?.[0]?.price ?? '0');
        if (!p.title || price <= 0) continue;
        allProducts.push({ name: p.title, productUrl, price, currency: 'EUR' });
      }

      if (products.length < 250) break;
      page++;
    }

    return allProducts;
  } catch {
    return [];
  }
};

export default scrapePSVEindhoven;
