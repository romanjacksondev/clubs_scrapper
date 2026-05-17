import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  const clubs = await prisma.club.findMany({
    where: { deletedAt: null },
    include: {
      league: { select: { name: true } },
      products: {
        where: { deletedAt: null },
        select: { updatedAt: true },
      },
    },
    orderBy: [{ league: { name: 'asc' } }, { name: 'asc' }],
  });

  const result = clubs.map((club) => {
    const lastScrapedAt =
      club.products.length > 0
        ? club.products.reduce<Date>(
            (max, p) => (p.updatedAt > max ? p.updatedAt : max),
            club.products[0].updatedAt,
          )
        : null;
    return {
      id: club.id,
      name: club.name,
      leagueId: club.leagueId,
      leagueName: club.league.name,
      productCount: club.products.length,
      lastScrapedAt: lastScrapedAt?.toISOString() ?? null,
    };
  });

  return NextResponse.json(result);
}
