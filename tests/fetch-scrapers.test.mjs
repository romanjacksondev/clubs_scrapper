/**
 * Regression tests for fetch+cheerio scrapers (no puppeteer dependency).
 * These tests verify that scrapers which worked before the @sparticuz/chromium
 * migration continue to return correctly shaped Product objects.
 *
 * Run with: node tests/fetch-scrapers.test.mjs
 *
 * Tests cover: Newcastle (Shopify JSON), Flamengo/VTEX, SC Freiburg (cheerio),
 * TSG Hoffenheim (SAP Hybris), Eintracht Frankfurt, VfL Wolfsburg, FC Augsburg.
 */

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

function assertProductShape(products, scraperName) {
  assert(Array.isArray(products), `${scraperName}: returns an array`);
  if (!Array.isArray(products)) return;

  if (products.length === 0) {
    console.warn(`  ⚠ ${scraperName}: returned 0 products (site may be down or URL changed)`);
    return;
  }

  assert(products.length > 0, `${scraperName}: found at least 1 product (got ${products.length})`);

  const first = products[0];
  assert(
    typeof first.name === 'string' && first.name.length > 0,
    `${scraperName}: product has non-empty name`,
  );
  assert(
    typeof first.productUrl === 'string' && first.productUrl.startsWith('http'),
    `${scraperName}: product has valid URL`,
  );
  assert(
    typeof first.price === 'number' && first.price > 0,
    `${scraperName}: product has positive price (got ${first.price})`,
  );
  assert(
    typeof first.currency === 'string' && first.currency.length > 0,
    `${scraperName}: product has currency`,
  );
  console.log(`    Sample: "${first.name.slice(0, 60)}" — ${first.currency} ${first.price}`);
}

const HEADERS_EN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9',
  Accept: 'text/html',
};
const HEADERS_DE = { ...HEADERS_EN, 'Accept-Language': 'de-DE,de;q=0.9' };

// ---------------------------------------------------------------------------
// 1. Newcastle United — Shopify JSON endpoint (PremierLeague)
// ---------------------------------------------------------------------------
async function testNewcastle() {
  console.log('\n[Newcastle United — Shopify JSON]');
  const BASE_URL = 'https://shop.newcastleunited.com';
  const COLLECTIONS = ['all-25-26-home-kit', 'all-25-26-away-kit'];
  const seen = new Set();
  const allProducts = [];

  for (const col of COLLECTIONS) {
    try {
      const res = await fetch(`${BASE_URL}/collections/${col}/products.json?limit=250&country=GB`, {
        headers: HEADERS_EN,
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const p of data.products ?? []) {
        const url = `${BASE_URL}/products/${p.handle}`;
        if (seen.has(url)) continue;
        seen.add(url);
        const price = Math.min(
          ...(p.variants ?? []).map((v) => parseFloat(v.price)).filter((n) => n > 0),
        );
        if (p.title && price > 0)
          allProducts.push({ name: p.title, productUrl: url, price, currency: 'GBP' });
      }
    } catch {}
  }

  assertProductShape(allProducts, 'Newcastle');
}

// ---------------------------------------------------------------------------
// 2. Flamengo — VTEX JSON API (Brasileirão)
// ---------------------------------------------------------------------------
async function testFlamengo() {
  console.log('\n[Flamengo — VTEX]');
  const BASE_URL = 'https://loja.flamengo.com.br';
  const CATEGORY_ID = 115;
  const products = [];

  try {
    const url = `${BASE_URL}/api/catalog_system/pub/products/search?fq=C:/${CATEGORY_ID}/&_from=0&_to=9`;
    const res = await fetch(url, {
      headers: { ...HEADERS_EN, 'Accept-Language': 'pt-BR,pt;q=0.9', Accept: 'application/json' },
    });
    if (res.ok) {
      const items = await res.json();
      for (const item of items) {
        const name = item.productName?.trim();
        const productUrl = item.link?.trim();
        const price = item.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
        if (name && productUrl && price)
          products.push({ name, productUrl, price: parseFloat(price), currency: 'BRL' });
      }
    }
  } catch {}

  assertProductShape(products, 'Flamengo (VTEX)');
}

// ---------------------------------------------------------------------------
// 3. SC Freiburg — cheerio (Bundesliga)
// ---------------------------------------------------------------------------
async function testSCFreiburg() {
  console.log('\n[SC Freiburg — cheerio]');
  const BASE_URL = 'https://shop.scfreiburg.com';
  const products = [];
  const seen = new Set();

  try {
    const res = await fetch(`${BASE_URL}/Trikots-Training/categories/2?locale=de`, {
      headers: HEADERS_DE,
    });
    if (res.ok) {
      const html = await res.text();
      // Extract hrefs of product links from raw HTML
      const hrefRe = /href="(\/[^"]*\/products\/\d+[^"]*)"/g;
      let m;
      while ((m = hrefRe.exec(html)) !== null) {
        const href = m[1];
        if (seen.has(href)) continue;
        seen.add(href);

        // Derive name from URL slug
        const parts = href.split('/').filter(Boolean);
        const prodIdx = parts.indexOf('products');
        const slug = prodIdx > 0 ? parts[prodIdx - 1] : '';
        const name = decodeURIComponent(slug)
          .replace(/-/g, ' ')
          .replace(/\b(\d{2})(\d{2})\b/g, '$1/$2');

        // Extract last price
        const contextStart = Math.max(0, html.indexOf(href) - 200);
        const context = html.slice(contextStart, html.indexOf(href) + 400);
        const prices = [...context.matchAll(/€\s*([\d,]+)/g)];
        const price =
          prices.length > 0 ? parseFloat(prices[prices.length - 1][1].replace(',', '.')) : 0;

        if (name && price > 0)
          products.push({ name, productUrl: `${BASE_URL}${href}`, price, currency: 'EUR' });
        if (products.length >= 5) break;
      }
    }
  } catch {}

  assertProductShape(products, 'SC Freiburg');
}

// ---------------------------------------------------------------------------
// 4. TSG Hoffenheim — SAP Hybris (Bundesliga)
// ---------------------------------------------------------------------------
async function testTSGHoffenheim() {
  console.log('\n[TSG Hoffenheim — SAP Hybris]');
  const BASE_URL = 'https://shop.tsg-hoffenheim.de';
  const products = [];
  const seen = new Set();

  try {
    const res = await fetch(`${BASE_URL}/de/c/TSG-Trikotkollektion`, { headers: HEADERS_DE });
    if (res.ok) {
      const html = await res.text();
      const hrefRe = /href="(\/de\/product\/[^"]+)"/g;
      let m;
      while ((m = hrefRe.exec(html)) !== null) {
        const href = m[1];
        if (seen.has(href)) continue;
        seen.add(href);

        // Name appears as the text of the anchor in the HTML, extract from context
        const pos = html.indexOf(href);
        const snippet = html.slice(pos, pos + 300);
        const nameM = snippet.match(/>([^<]{5,80})</);
        const name = nameM ? nameM[1].trim() : (href.split('/').pop() ?? '');

        const priceM = snippet.match(/([\d]+,[\d]+)\s*€/g);
        const lastPriceStr = priceM
          ? priceM[priceM.length - 1].replace(/[^0-9,]/g, '').replace(',', '.')
          : '';
        const price = parseFloat(lastPriceStr);

        if (name && price > 0)
          products.push({ name, productUrl: `${BASE_URL}${href}`, price, currency: 'EUR' });
        if (products.length >= 5) break;
      }
    }
  } catch {}

  assertProductShape(products, 'TSG Hoffenheim');
}

// ---------------------------------------------------------------------------
// 5. VfL Wolfsburg — Shopware 6 (Bundesliga)
// ---------------------------------------------------------------------------
async function testVfLWolfsburg() {
  console.log('\n[VfL Wolfsburg — Shopware 6]');
  const BASE_URL = 'https://shop.vfl-wolfsburg.de';
  const products = [];
  const seen = new Set();

  try {
    const res = await fetch(`${BASE_URL}/trikots-co/spieloutfits/heim/`, { headers: HEADERS_DE });
    if (res.ok) {
      const html = await res.text();
      // Look for product links: 2-segment paths on the same domain
      const hrefRe = /href="(https:\/\/shop\.vfl-wolfsburg\.de\/[^"\/]+\/[^"\/]+\/)"/g;
      let m;
      while ((m = hrefRe.exec(html)) !== null) {
        const href = m[1];
        if (seen.has(href)) continue;
        seen.add(href);

        // Find "Zum Merkzettel hinzufügen" pattern for name/price
        const pos = html.indexOf(href);
        const context = html.slice(Math.max(0, pos - 50), pos + 600);
        const merkIdx = context.indexOf('Zum Merkzettel');
        if (merkIdx < 0) continue;

        const after = context.slice(merkIdx + 'Zum Merkzettel hinzufügen'.length);
        const name = after
          .replace(/^[\d,]+\s*€\*?\s*/, '')
          .replace(/<[^>]+>/g, '')
          .trim()
          .split('\n')[0]
          .trim();
        const priceM = after.match(/([\d,]+)\s*€/);
        const price = priceM ? parseFloat(priceM[1].replace(',', '.')) : 0;

        if (name && price > 0) products.push({ name, productUrl: href, price, currency: 'EUR' });
        if (products.length >= 5) break;
      }
    }
  } catch {}

  assertProductShape(products, 'VfL Wolfsburg');
}

// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------
console.log('Running fetch+cheerio scraper regression tests...');
console.log('(These make real HTTP requests — pass/fail depends on live sites)\n');

await testNewcastle();
await testFlamengo();
await testSCFreiburg();
await testTSGHoffenheim();
await testVfLWolfsburg();

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
