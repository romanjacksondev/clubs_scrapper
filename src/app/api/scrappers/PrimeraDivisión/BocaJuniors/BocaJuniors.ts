import { Product } from '../../PremierLeague/Product';

const BASE_URL = 'https://www.bocashop.com.ar';

// VTEX catalog API — category tree path for "Camisetas" is /3/6/
// Products are paginated in batches of 50.
const CATEGORY_PATH = 'C:/3/6/';
const PAGE_SIZE = 50;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'es-AR,es;q=0.9',
};

export default async function scrapeBocaJuniors(): Promise<Product[]> {
  const products: Product[] = [];
  let from = 0;

  while (true) {
    const url = `${BASE_URL}/api/catalog_system/pub/products/search?fq=${encodeURIComponent(CATEGORY_PATH)}&_from=${from}&_to=${from + PAGE_SIZE - 1}`;
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
  }

  return products;
}
