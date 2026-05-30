// Ajax official store (www.ajax.nl/shop) — custom Next.js + Umbraco CMS storefront.
// Kit category pages embed product data in __NEXT_DATA__ JSON under
// props.pageProps.productPagination.products.
// Each product has: displayValue (name), path (/product/slug-id), price.original.

import { Product } from '../../shared/Product';

const STORE_BASE = 'https://www.ajax.nl';

const KIT_URLS = [
  `${STORE_BASE}/shop/wedstrijd/thuistenue`,
  `${STORE_BASE}/shop/wedstrijd/uittenue`,
  `${STORE_BASE}/shop/wedstrijd/derde-tenue`,
  `${STORE_BASE}/shop/wedstrijd/keeperstenue`,
];

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

interface AjaxProduct {
  displayValue?: string;
  path?: string;
  price?: { original?: number; sale?: number | null };
  currencyId?: string;
}

const scrapeAjax = async (): Promise<Product[]> => {
  const seen = new Set<string>();
  const allProducts: Product[] = [];

  for (const url of KIT_URLS) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();

      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)/);
      if (!match) continue;

      const json = JSON.parse(match[1]);
      const products: AjaxProduct[] = json?.props?.pageProps?.productPagination?.products ?? [];

      for (const p of products) {
        const name = p.displayValue?.trim();
        if (!name || name.length < 3) continue;

        const path = p.path;
        if (!path) continue;
        const productUrl = `${STORE_BASE}${path}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const price = p.price?.sale ?? p.price?.original ?? 0;
        if (!price || price <= 0) continue;

        allProducts.push({ name, productUrl, price, currency: 'EUR' });
      }
    } catch {
      // skip this URL
    }
  }
  return allProducts;
};

export default scrapeAjax;
