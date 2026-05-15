/**
 * Test for the Newcastle scrapper
 * Run with: node tests/newcastle.test.mjs
 */

const BASE_URL = 'https://shop.newcastleunited.com';
const COLLECTIONS = ['all-25-26-home-kit', 'all-25-26-away-kit', 'all-25-26-third-kit'];

const seen = new Set();
const allProducts = [];

for (const collection of COLLECTIONS) {
  const url = `${BASE_URL}/collections/${collection}/products.json?limit=250&country=GB`;
  console.log(`\nFetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });
  console.log(`  HTTP ${res.status}`);
  if (!res.ok) continue;

  const data = await res.json();
  const products = data.products ?? [];
  console.log(`  Products: ${products.length}`);

  for (const product of products) {
    const productUrl = `${BASE_URL}/products/${product.handle}`;
    if (seen.has(productUrl)) continue;
    seen.add(productUrl);

    const name = product.title?.trim();
    const prices = (product.variants ?? []).map((v) => parseFloat(v.price)).filter((p) => p > 0);
    const price = prices.length > 0 ? Math.min(...prices) : NaN;

    if (name && price > 0) {
      allProducts.push({ name, productUrl, price, currency: 'GBP' });
    }
  }
}

console.log(`\nTotal products scraped: ${allProducts.length}`);
allProducts.slice(0, 5).forEach((p) => console.log(p));
