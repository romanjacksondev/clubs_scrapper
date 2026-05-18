// VTEX store (soycuervo.com — San Lorenzo de Almagro).
// Uses fulltext search (?ft=camiseta) because the VTEX category tree
// does not return products via the standard fq=C:/ category path.
// Paginated in batches of 50.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://www.soycuervo.com';

const PAGE_SIZE = 50;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'es-AR,es;q=0.9',
};

export default async function scrapeSanLorenzo(): Promise<Product[]> {
  const products: Product[] = [];
  let from = 0;

  while (true) {
    const url = `${BASE_URL}/api/catalog_system/pub/products/search?ft=camiseta&_from=${from}&_to=${from + PAGE_SIZE - 1}`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) break;
      const items: any[] = await res.json();
      if (!items.length) break;

      for (const item of items) {
        const name: string = item.productName?.trim();
        const productUrl: string = item.link?.trim();
        const price = item.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
        if (!name || !productUrl || !price) continue;
        products.push({ name, productUrl, price: parseFloat(price), currency: 'ARS' });
      }

      from += PAGE_SIZE;
      if (items.length < PAGE_SIZE) break;
    } catch (e) {
      console.error(`Error scraping San Lorenzo page starting at ${from}:`, e);
      break;
    }
  }

  return products;
}
