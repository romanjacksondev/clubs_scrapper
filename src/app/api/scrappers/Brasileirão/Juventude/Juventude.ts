import { Product } from '../../shared/Product';

// Juventude official store — Loja do Juventude (moderniza.me/juventude — WooCommerce)
// WP REST API at wp-json/wp/v2/product lists all products (no auth needed),
// but prices are not in the list response. Price is fetched from each product
// page via the embedded JSON-LD / WooCommerce variation data.

const BASE_URL = 'https://moderniza.me/juventude';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

async function fetchPrice(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { headers: { ...HEADERS, Accept: 'text/html' } });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"price"\s*:\s*"([\d.]+)"/);
    return match ? parseFloat(match[1]) : null;
  } catch {
    return null;
  }
}

export default async function scrapeJuventude(): Promise<Product[]> {
  const listRes = await fetch(`${BASE_URL}/wp-json/wp/v2/product?per_page=100&status=publish`, {
    headers: HEADERS,
  });
  if (!listRes.ok) return [];

  const items: any[] = await listRes.json();

  // Keep only shirt/kit products
  const shirtItems = items.filter((item) => /camisa/i.test(item.title?.rendered ?? ''));

  const products: Product[] = [];
  await Promise.all(
    shirtItems.map(async (item) => {
      const name: string = item.title?.rendered?.trim();
      const productUrl: string = item.link?.trim();
      if (!name || !productUrl) return;
      const price = await fetchPrice(productUrl);
      if (!price) return;
      products.push({ name, productUrl, price, currency: 'BRL' });
    }),
  );

  return products;
}
