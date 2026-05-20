// Nottingham Forest store (shop.nottinghamforest.co.uk) runs on Shopify.
// The standard Shopify products.json endpoint returns GBP prices when
// ?country=GB is appended — no browser automation needed.
// 'kits' covers all 7 current kit sale items (away, third, goalkeeper sub-collections
// are strict subsets). 'kit-training-wear-sale' adds ~10 discounted training items.
// 'training' covers the full training-wear catalog for price-drop tracking.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://shop.nottinghamforest.co.uk';

const COLLECTIONS = ['kits', 'kit-training-wear-sale', 'training'];

const scrapeNottinghamForest = async (): Promise<Product[]> => {
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
        console.error(`NottinghamForest: HTTP ${res.status} for collection ${collection}`);
        continue;
      }

      const data = await res.json();
      const products: any[] = data.products ?? [];

      for (const product of products) {
        const productUrl = `${BASE_URL}/products/${product.handle}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const name: string = product.title?.trim();
        const prices = (product.variants ?? [])
          .map((v: any) => parseFloat(v.price))
          .filter((p: number) => p > 0);
        const price = prices.length > 0 ? Math.min(...prices) : NaN;

        if (name && productUrl && price > 0) {
          allProducts.push({ name, productUrl, price, currency: 'GBP' });
        }
      }
    } catch (err) {
      console.error(`NottinghamForest: error scraping collection ${collection}:`, err);
    }
  }

  return allProducts;
};

export default scrapeNottinghamForest;
