// Eintracht Frankfurt official store (stores.eintracht.de) — Gatsby static site.
// Product data is embedded in Gatsby page-data.json files — no Puppeteer needed.
// Each category page exposes .result.data.allNewShopProduct.nodes with name, slug, and variant pricing.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://stores.eintracht.de';

const JERSEY_PAGE_DATA = [
  `${BASE_URL}/page-data/fanshop/adidas/heimtrikot/page-data.json`,
  `${BASE_URL}/page-data/fanshop/adidas/auswaertstrikot/page-data.json`,
  `${BASE_URL}/page-data/fanshop/adidas/ausweichtrikot/page-data.json`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

interface EFVariantPrice {
  customerGroup: string;
  price: number;
}

interface EFVariant {
  prices: EFVariantPrice[];
}

interface EFProductNode {
  name: { de: string };
  full_slugs: { de: string };
  variants: EFVariant[];
}

export default async function scrapeEintrachtFrankfurt(): Promise<Product[]> {
  const allProducts: Product[] = [];
  const seen = new Set<string>();

  for (const jsonUrl of JERSEY_PAGE_DATA) {
    try {
      const res = await fetch(jsonUrl, { headers: HEADERS });
      if (!res.ok) continue;

      const data = await res.json();
      const nodes: EFProductNode[] = data?.result?.data?.allNewShopProduct?.nodes ?? [];

      for (const node of nodes) {
        const name = node.name?.de;
        const slug = node.full_slugs?.de;
        if (!name || !slug) continue;

        const productUrl = `${BASE_URL}${slug.replace(/\/$/, '')}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        // Use the retail (EK = Einzelkunde) price from the first variant
        const prices = node.variants?.[0]?.prices ?? [];
        const ekPrice = prices.find((p) => p.customerGroup === 'EK');
        const price = ekPrice?.price ?? 0;
        if (price <= 0) continue;

        allProducts.push({ name, productUrl, price, currency: 'EUR' });
      }
    } catch (e) {
      console.error(`Error scraping EintrachtFrankfurt at ${jsonUrl}:`, e);
    }
  }

  return allProducts;
}
