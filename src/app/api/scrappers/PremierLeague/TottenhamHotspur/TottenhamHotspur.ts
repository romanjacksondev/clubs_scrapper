import { Product } from '../Product';

const BASE_URL = 'https://shop.tottenhamhotspur.com';

// The GlobalE_Data cookie tells the SFCC store which country/currency to use.
// Without it the server geo-detects the IP and returns local (ARS) prices.
const GLOBAL_E_COOKIE = encodeURIComponent(
  JSON.stringify({ countryISO: 'GB', cultureCode: 'en', currencyCode: 'GBP', apiVersion: '2.1.4' }),
);

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9',
  Cookie: `GlobalE_Data=${GLOBAL_E_COOKIE}`,
};

async function scrapeTottenham(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/all-spurs-kit`, { headers: HEADERS });
  if (!res.ok) return [];
  const html = await res.text();

  // Each product tile starts with <div class="product" data-pid="…">
  const parts = html.split('<div class="product" data-pid=');
  const seen = new Set<string>();
  const products: Product[] = [];

  for (let i = 1; i < parts.length; i++) {
    const block = parts[i];
    const href = block.match(/href="(\/products\/[^"]+)"/)?.[1];
    const name = block.match(/class="link fs-md[^"]*"[^>]*>\s*([^<\n]+?)\s*<\/a>/)?.[1]?.trim();
    const price = parseFloat(block.match(/content="([\d.]+)"/)?.[1] ?? '0');
    if (!name || !href || !price) continue;
    const productUrl = BASE_URL + href;
    if (seen.has(productUrl)) continue;
    seen.add(productUrl);
    products.push({ name, productUrl, price, currency: 'GBP' });
  }

  return products;
}

export default scrapeTottenham;
