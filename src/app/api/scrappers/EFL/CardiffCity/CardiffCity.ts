// Cardiff City official store (www.cardiffcityfcstore.com) — JonasSports platform.
// Product listings are JS-rendered, but individual product detail pages include a
// server-rendered GA Enhanced Ecommerce data layer containing name and price.
// Strategy: parse the sitemap for all /fashion/ product page URLs, then batch-fetch
// each page and extract the GA detail block.

import { Product } from '../../shared/Product';

const SITEMAP_URL = 'https://www.cardiffcityfcstore.com/sitemap.xml';
const BASE_URL = 'https://www.cardiffcityfcstore.com';

// Matches the first GA 'detail' ecommerce product block on a product page:
//   'name': 'PRODUCT NAME', 'id': '...', 'price': '45.00', ...
const GA_DETAIL_RE = /'name'\s*:\s*'([^']+)'[\s\S]{0,300}?'price'\s*:\s*'([\d.]+)'/;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html',
  'Accept-Language': 'en-GB,en;q=0.9',
};

const BATCH_SIZE = 15;

async function fetchProductPage(url: string): Promise<Product | null> {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(GA_DETAIL_RE);
    if (!m) return null;
    return {
      name: m[1].replace(/\\'/g, "'"),
      productUrl: url,
      price: parseFloat(m[2]),
      currency: 'GBP',
    };
  } catch {
    return null;
  }
}

const scrapeCardiffCity = async (): Promise<Product[]> => {
  // 1. Fetch sitemap to get all product page URLs
  let xml: string;
  try {
    const res = await fetch(SITEMAP_URL, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  // 2. Extract all /fashion/ product page URLs (.html)
  const productUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.endsWith('.html') && u.includes(`${BASE_URL}/fashion/`));

  if (productUrls.length === 0) return [];

  // 3. Batch-fetch product pages and extract GA data
  const products: Product[] = [];
  for (let i = 0; i < productUrls.length; i += BATCH_SIZE) {
    const batch = productUrls.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchProductPage));
    products.push(...results.filter((p): p is Product => p !== null));
  }

  return products;
};

export default scrapeCardiffCity;
