import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates } from '../../../lib/exchangeRates';
import { prisma } from '../../../lib/prisma';

const DEFAULT_DISCOUNT_THRESHOLD = 0.3;

interface DiscountRow {
  id: number;
  name: string;
  currentPrice: number;
  previousPrice: number;
  discountPercent: number;
  currency: string;
  productUrl: string;
  clubName: string;
  leagueName: string;
  discountFoundAt: Date;
}

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('minDiscount');
  const parsed = param !== null ? parseFloat(param) / 100 : NaN;
  const threshold =
    !isNaN(parsed) && parsed > 0 && parsed <= 1 ? parsed : DEFAULT_DISCOUNT_THRESHOLD;

  const [rows, ratesMap] = await Promise.all([
    prisma.$queryRaw<DiscountRow[]>`
      SELECT
        p.id::int                                                                AS "id",
        p.name                                                                   AS "name",
        p.price::float8                                                          AS "currentPrice",
        ph_prev.price::float8                                                    AS "previousPrice",
        ROUND(((ph_prev.price - p.price) / ph_prev.price)::numeric * 100)::int  AS "discountPercent",
        p.currency                                                               AS "currency",
        p."productUrl"                                                           AS "productUrl",
        c.name                                                                   AS "clubName",
        l.name                                                                   AS "leagueName",
        COALESCE(ph_curr."recordedAt", p."updatedAt")                           AS "discountFoundAt"
      FROM "Product"  p
      JOIN "Club"     c  ON c.id = p."clubId"
      JOIN "League"   l  ON l.id = c."leagueId"
      JOIN LATERAL (
        SELECT price
        FROM   "ProductHistory"
        WHERE  "productId" = p.id
          AND  price > p.price
          AND  currency = p.currency
        ORDER BY "recordedAt" DESC
        LIMIT  1
      ) ph_prev ON true
      LEFT JOIN LATERAL (
        SELECT "recordedAt"
        FROM   "ProductHistory"
        WHERE  "productId" = p.id
          AND  price = p.price
          AND  currency = p.currency
        ORDER BY "recordedAt" DESC
        LIMIT  1
      ) ph_curr ON true
      WHERE p."deletedAt" IS NULL
        AND c."deletedAt" IS NULL
        AND l."deletedAt" IS NULL
        AND (ph_prev.price - p.price) / ph_prev.price >= ${threshold}
      ORDER BY "discountFoundAt" DESC
    `,
    getExchangeRates().catch(() => null),
  ]);

  const withUsd = rows.map((row) => {
    const rate = ratesMap?.get(row.currency);
    return {
      ...row,
      currentPriceUsd: rate != null ? Math.round(row.currentPrice * rate * 100) / 100 : null,
      previousPriceUsd: rate != null ? Math.round(row.previousPrice * rate * 100) / 100 : null,
    };
  });

  return NextResponse.json(withUsd, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
