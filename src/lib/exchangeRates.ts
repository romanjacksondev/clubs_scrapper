import { prisma } from './prisma';

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Returns a map of currency code → rate-to-USD (1 unit of currency = X USD).
 * Fetches from frankfurter.app at most once per day and caches in the DB.
 */
export async function getExchangeRates(): Promise<Map<string, number>> {
  // Check if we have a fresh USD entry (serves as a proxy for all rates being fresh)
  const usdRow = await prisma.exchangeRate.findUnique({ where: { currency: 'USD' } });
  const isStale = !usdRow || Date.now() - usdRow.updatedAt.getTime() > STALE_AFTER_MS;

  if (!isStale) {
    const rows = await prisma.exchangeRate.findMany();
    return new Map(rows.map((r) => [r.currency, r.rateToUsd]));
  }

  // Fetch latest rates from frankfurter.app (ECB data, no API key required).
  // Base = USD: data.rates[X] means "1 USD = X units of currency X".
  const res = await fetch('https://api.frankfurter.app/latest?base=USD');
  if (!res.ok) {
    // Fall back to stale DB data if fetch fails
    const rows = await prisma.exchangeRate.findMany();
    if (rows.length > 0) return new Map(rows.map((r) => [r.currency, r.rateToUsd]));
    throw new Error('Exchange rate fetch failed and no cached data available');
  }

  const data = (await res.json()) as { rates: Record<string, number> };
  // rateToUsd = 1 / data.rates[currency]  →  "1 unit = ? USD"
  const rateMap: Record<string, number> = { USD: 1.0 };
  for (const [currency, unitsPerUsd] of Object.entries(data.rates)) {
    rateMap[currency] = 1 / unitsPerUsd;
  }

  // Upsert all rates in a single transaction
  await prisma.$transaction(
    Object.entries(rateMap).map(([currency, rateToUsd]) =>
      prisma.exchangeRate.upsert({
        where: { currency },
        create: { currency, rateToUsd },
        update: { rateToUsd },
      }),
    ),
  );

  return new Map(Object.entries(rateMap));
}
