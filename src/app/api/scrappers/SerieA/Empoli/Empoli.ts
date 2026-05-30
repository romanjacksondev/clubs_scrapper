// shop.empolifc.it — Wix platform store.
// The sitemap exposes all kit-gara product URLs (/store/{slug}).
// Each product page embeds price data in a JS object ("price":N.N,"onSale":...)
// and the product name is available in the <title> tag.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.empolifc.it';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

const scrapeEmpoli = async (): Promise<Product[]> => {
  try {
    // Step 1: collect kit-gara product URLs from the sitemap
    const smRes = await fetch(SITEMAP_URL, { headers: HEADERS });
    if (!smRes.ok) return [];
    const sitemapXml = await smRes.text();

    const productUrls = [
      ...sitemapXml.matchAll(
        /<loc>(https:\/\/shop\.empolifc\.it\/store\/[^<]*gara[^<]*)<\/loc>/gi,
      ),
    ]
      .map((m) => m[1])
      // Exclude Wix store copy-artifacts (e.g. slug-copy, slug-copy-copy)
      .filter((u) => !u.includes('-copy'));

    if (productUrls.length === 0) return [];

    const products: Product[] = [];
    const seen = new Set<string>();

    for (const productUrl of productUrls) {
      if (seen.has(productUrl)) continue;
      try {
        const res = await fetch(productUrl, { headers: HEADERS });
        if (!res.ok) continue;
        const html = await res.text();

        // Product name from <title>, strip variant suffix after "–"
        const rawTitle =
          html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim() ?? '';
        const name = rawTitle.replace(/\s*–\s.+$/, '').trim() || rawTitle;
        if (!name) continue;

        // Price embedded in page JS: "price":N.N,"onSale":...
        const priceMatch = html.match(/"price"\s*:\s*([\d.]+)\s*,\s*"onSale"/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        if (price <= 0) continue;

        seen.add(productUrl);
        products.push({ name, productUrl, price, currency: 'EUR' });
      } catch {
        continue;
      }
    }

    return products;
  } catch {
    return [];
  }
};

export default scrapeEmpoli;
