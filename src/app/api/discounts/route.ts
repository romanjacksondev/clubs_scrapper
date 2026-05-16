import { NextRequest, NextResponse } from 'next/server';
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
}

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('minDiscount');
  const parsed = param !== null ? parseFloat(param) / 100 : NaN;
  const threshold =
    !isNaN(parsed) && parsed > 0 && parsed <= 1 ? parsed : DEFAULT_DISCOUNT_THRESHOLD;

  const rows = await prisma.$queryRaw<DiscountRow[]>`
    SELECT
      p.id::int                                                                AS "id",
      p.name                                                                   AS "name",
      p.price::float8                                                          AS "currentPrice",
      ph_prev.price::float8                                                    AS "previousPrice",
      ROUND(((ph_prev.price - p.price) / ph_prev.price)::numeric * 100)::int  AS "discountPercent",
      p.currency                                                               AS "currency",
      p."productUrl"                                                           AS "productUrl",
      c.name                                                                   AS "clubName",
      l.name                                                                   AS "leagueName"
    FROM "Product"  p
    JOIN "Club"     c  ON c.id = p."clubId"
    JOIN "League"   l  ON l.id = c."leagueId"
    JOIN LATERAL (
      SELECT price
      FROM   "ProductHistory"
      WHERE  "productId" = p.id
        AND  price > p.price
      ORDER BY "recordedAt" DESC
      LIMIT  1
    ) ph_prev ON true
    WHERE p."deletedAt" IS NULL
      AND c."deletedAt" IS NULL
      AND l."deletedAt" IS NULL
      AND (ph_prev.price - p.price) / ph_prev.price >= ${threshold}
    ORDER BY "discountPercent" DESC
  `;

  return NextResponse.json(rows);
}
