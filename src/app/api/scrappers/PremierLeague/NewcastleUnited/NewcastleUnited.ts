// Newcastle United store (shop.newcastleunited.com) runs on Shopify.
// The standard Shopify products.json endpoint returns GBP prices when
// ?country=GB is appended — no browser automation needed.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.newcastleunited.com';

const COLLECTIONS = ['all-25-26-home-kit', 'all-25-26-away-kit', 'all-25-26-third-kit'];

const scrapeNewcastle = async (): Promise<Product[]> => {
  const seen = new Set<string>();
  const allProducts: Product[] = [];

  for (const collection of COLLECTIONS) {
    try {
      const url = `${BASE_URL}/collections/${collection}/products.json?limit=250&country=GB`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
      });

      if (!res.ok) {
        console.error(`Newcastle: HTTP ${res.status} for collection ${collection}`);
        continue;
      }

      const data = await res.json();
      const products: any[] = data.products ?? [];

      for (const product of products) {
        const productUrl = `${BASE_URL}/products/${product.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const name: string = product.title?.trim();
        // Use the lowest available variant price as the product price
        const prices = (product.variants ?? [])
          .map((v: any) => parseFloat(v.price))
          .filter((p: number) => p > 0);
        const price = prices.length > 0 ? Math.min(...prices) : NaN;

        if (name && productUrl && price > 0) {
          allProducts.push({ name, productUrl, price, currency: 'GBP' });
        }
      }
    } catch (err) {
      console.error(`Newcastle: error scraping collection ${collection}:`, err);
    }
  }

  return allProducts;
};

export default scrapeNewcastle;
