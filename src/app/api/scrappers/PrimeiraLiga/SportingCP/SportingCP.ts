// Sporting CP official store: lojaverde.sporting.pt (NopCommerce Angular SPA).
// Uses the /api/category/getProductsByCategory/{id} endpoint which is public.
// Category 13 = Equipamentos (all match/training kits).

import { Product } from '../../shared/Product';

const BASE_URL = 'https://lojaverde.sporting.pt';
const EQUIPAMENTOS_CATEGORY_ID = 13;
const PAGE_SIZE = 50;

export default async function scrapeSpotingCP(): Promise<Product[]> {
  const products: Product[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}/api/category/getProductsByCategory/${EQUIPAMENTOS_CATEGORY_ID}?page=${page}&size=${PAGE_SIZE}&order=0`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
        Referer: `${BASE_URL}/pt/categoria/equipamentos-sporting`,
      },
    });

    if (!res.ok) break;

    const data = await res.json();
    if (data.Status !== 1 || !data.Data?.Products) break;

    const pageProducts: Product[] = data.Data.Products.map((p: Record<string, unknown>) => {
      const price = (p.ProductPrice as Record<string, unknown>)?.PriceValue;
      return {
        name: p.Name as string,
        productUrl: `${BASE_URL}/pt/produto/${p.SeName}`,
        price: typeof price === 'number' ? price : 0,
        currency: 'EUR',
      };
    });

    products.push(...pageProducts);

    if (pageProducts.length < PAGE_SIZE) break;
    page++;
  }

  return products;
}
