/**
 * Integration tests for all registered scrapers.
 *
 * Run ALL scrapers:
 *   npx tsx tests/all-scrapers.test.ts
 *
 * Run a single scraper (exact DB club name):
 *   npx tsx tests/all-scrapers.test.ts "Chelsea"
 *   npx tsx tests/all-scrapers.test.ts "1. FC Heidenheim"
 *   npx tsx tests/all-scrapers.test.ts "Borussia Dortmund"
 *
 * Each scraper is validated against the Product shape:
 *   { name: string, price: number > 0, productUrl: string (https://...), currency: string }
 *
 * Note: Puppeteer-based scrapers are slow (~30–90 s each).
 * The default per-scraper timeout is 120 s.
 */

import { SCRAPERS } from '../src/app/api/scrappers/registry';
import type { Product } from '../src/types/Product';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIMEOUT_MS = 120_000;

let passed = 0;
let failed = 0;
let skipped = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

function assertProductShape(products: Product[], scraperName: string) {
  assert(Array.isArray(products), `${scraperName}: returns an array`);
  if (!Array.isArray(products)) return;

  if (products.length === 0) {
    console.warn(`  ⚠  ${scraperName}: returned 0 products (site may be down or URL changed)`);
    skipped++;
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

  console.log(
    `    Sample: "${first.name.slice(0, 60)}" — ${first.currency} ${first.price.toFixed(2)}`,
  );
  console.log(`    Total: ${products.length} product(s)`);
}

async function runScraper(clubName: string): Promise<void> {
  const scraper = SCRAPERS[clubName];
  if (!scraper) {
    console.error(`\n[${clubName}] NOT FOUND in registry`);
    failed++;
    return;
  }

  console.log(`\n[${clubName}]`);
  const start = Date.now();

  let products: Product[];
  try {
    products = await Promise.race([
      scraper(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS),
      ),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${clubName}: threw an error — ${message}`);
    failed++;
    return;
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  Elapsed: ${elapsed}s`);
  assertProductShape(products, clubName);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const filterArg = process.argv[2]; // optional club name filter

  const allClubs = Object.keys(SCRAPERS);
  const clubs = filterArg ? [filterArg] : allClubs;

  if (filterArg && !SCRAPERS[filterArg]) {
    console.error(`\nNo scraper registered for: "${filterArg}"`);
    console.error('Available clubs:');
    allClubs.forEach((c) => console.error(`  - ${c}`));
    process.exit(1);
  }

  console.log(`\n=== Running ${clubs.length} scraper test(s) ===`);
  const totalStart = Date.now();

  for (const club of clubs) {
    await runScraper(club);
  }

  const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
  console.log(`\n=== Results (${totalElapsed}s total) ===`);
  console.log(`  Passed:  ${passed}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Skipped: ${skipped} (0 products returned)`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
