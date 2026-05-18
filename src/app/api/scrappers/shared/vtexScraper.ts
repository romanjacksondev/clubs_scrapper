import { Product } from './Product';

const PAGE_SIZE = 50;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

/**
 * Generic VTEX catalog scraper.
 * @param baseUrl  - e.g. https://loja.flamengo.com.br
 * @param categoryId - integer category ID from /api/catalog_system/pub/category/tree
 * @param currency   - default 'BRL'
 */
export async function scrapeVtexStore(
  baseUrl: string,
  categoryId: number,
  currency = 'BRL',
): Promise<Product[]> {
  const products: Product[] = [];
  let from = 0;

  while (true) {
    const url = `${baseUrl}/api/catalog_system/pub/products/search?fq=C:/${categoryId}/&_from=${from}&_to=${from + PAGE_SIZE - 1}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) break;
    const items: any[] = await res.json();
    if (!items.length) break;

    for (const item of items) {
      const name: string = item.productName?.trim();
      const productUrl: string = item.link?.trim();
      const price = item.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
      if (!name || !productUrl || !price) continue;
      products.push({ name, productUrl, price: parseFloat(price), currency });
    }

    from += PAGE_SIZE;
    if (items.length < PAGE_SIZE) break;
  }

  return products;
}
