// Torino FC official store (torinofcstore.com) — PrestaShop.
// The kit-gara category page (/it/18-kit-gara) lists sub-category pages.
// Each sub-category page contains product articles with data-id-product attributes
// and a `wk_category_products` JS analytics variable with name/price data.

import { Product } from '../../shared/Product';

const KITS_URL = 'https://torinofcstore.com/it/18-kit-gara';

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9',
};

interface WKProduct {
  product_name?: string;
  product_id?: string | number;
  price?: string | number;
}

const scrapeTorino = async (): Promise<Product[]> => {
  try {
    // Step 1: find sub-category pages from the main kit-gara page
    const mainRes = await fetch(KITS_URL, { headers: HEADERS });
    if (!mainRes.ok) return [];
    const mainHtml = await mainRes.text();

    const subCatUrls = [
      ...new Set(
        [...mainHtml.matchAll(/href="(https:\/\/torinofcstore\.com\/it\/\d+-[^"]+)"/g)]
          .map((m) => m[1])
          .filter((u) => u !== KITS_URL),
      ),
    ];
    if (subCatUrls.length === 0) return [];

    const products: Product[] = [];
    const seen = new Set<string>();

    for (const catUrl of subCatUrls) {
      try {
        const res = await fetch(catUrl, { headers: HEADERS });
        if (!res.ok) continue;
        const html = await res.text();

        // Build name+price map from the analytics data layer
        const wkMatch = html.match(/wk_category_products\s*=\s*(\[[\s\S]*?\]);/);
        const wkItems: WKProduct[] = wkMatch ? (JSON.parse(wkMatch[1]) as WKProduct[]) : [];
        const wkMap = new Map(wkItems.map((it) => [String(it.product_id), it]));

        // Strip HTML comments so commented-out hrefs are ignored
        const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');

        // Extract each product article
        const artRegex =
          /<article[^>]*data-id-product="(\d+)"[^>]*>([\s\S]*?)<\/article>/g;
        let artMatch: RegExpExecArray | null;
        while ((artMatch = artRegex.exec(cleanHtml)) !== null) {
          const productId = artMatch[1];
          const artHtml = artMatch[2];

          const hrefMatch = artHtml.match(
            /href="(https:\/\/torinofcstore\.com\/it\/[^"]*\.html[^"]*)"/,
          );
          if (!hrefMatch) continue;
          const productUrl = hrefMatch[1].split('#')[0];
          if (seen.has(productUrl)) continue;

          const wkItem = wkMap.get(productId);
          if (!wkItem?.product_name) continue;

          const name = wkItem.product_name.trim();
          const price =
            typeof wkItem.price === 'number'
              ? wkItem.price
              : parseFloat(String(wkItem.price ?? '0').replace(',', '.'));
          if (!name || price <= 0) continue;

          seen.add(productUrl);
          products.push({ name, productUrl, price, currency: 'EUR' });
        }
      } catch {
        continue;
      }
    }

    return products;
  } catch {
    return [];
  }
};

export default scrapeTorino;
