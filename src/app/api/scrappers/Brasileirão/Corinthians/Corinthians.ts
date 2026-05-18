import { Product } from '../../shared/Product';

// Corinthians official store — Shop Timão (Netshoes platform)
// /api/friendly/{category} returns paginated products, page=1..N
// salePrice is in cents (divide by 100)

const BASE_URL = 'https://www.shoptimao.com.br';
const CATEGORY = 'camisas';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

export default async function scrapeCorinthians(): Promise<Product[]> {
  const products: Product[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `${BASE_URL}/api/friendly/${CATEGORY}?page=${page}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) break;
    const data: any = await res.json();

    totalPages = data.totalPages ?? 1;

    for (const item of data.parentSkus ?? []) {
      const name: string = item.name?.trim();
      const slug: string = item.productSlug?.trim();
      const salePrice: number = item.salePrice;
      if (!name || !slug || !salePrice) continue;
      products.push({
        name,
        productUrl: `${BASE_URL}${slug}`,
        price: salePrice / 100,
        currency: 'BRL',
      });
    }

    page++;
  } while (page <= totalPages);

  return products;
}
