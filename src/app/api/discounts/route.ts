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
      p.id::int                                                             AS "id",
      p.name                                                                AS "name",
      p.price::float8                                                       AS "currentPrice",
      MAX(ph.price)::float8                                                 AS "previousPrice",
      ROUND(((MAX(ph.price) - p.price) / MAX(ph.price))::numeric * 100)::int
                                                                            AS "discountPercent",
      p.currency                                                            AS "currency",
      p."productUrl"                                                        AS "productUrl",
      c.name                                                                AS "clubName",
      l.name                                                                AS "leagueName"
    FROM "Product"        p
    JOIN "ProductHistory" ph ON ph."productId" = p.id
    JOIN "Club"           c  ON c.id           = p."clubId"
    JOIN "League"         l  ON l.id           = c."leagueId"
    WHERE p."deletedAt" IS NULL
      AND c."deletedAt" IS NULL
      AND l."deletedAt" IS NULL
    GROUP BY p.id, p.name, p.price, p.currency, p."productUrl", c.name, l.name
    HAVING (MAX(ph.price) - p.price) / MAX(ph.price) >= ${threshold}
    ORDER BY "discountPercent" DESC
  `;

  return NextResponse.json(rows);
}
