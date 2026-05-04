import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const DISCOUNT_THRESHOLD = 0.3;

export async function GET() {
  // Fetch all products that have at least one history entry showing a 30%+ price drop
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      history: { orderBy: { recordedAt: 'asc' } },
      club: { include: { league: true } },
    },
  });

  const discounted = products
    .map((product) => {
      const historicalPrices = product.history.map((h) => h.price);
      if (historicalPrices.length === 0) return null;

      const maxHistoricalPrice = Math.max(...historicalPrices);
      const currentPrice = product.price;
      const discountPercent = (maxHistoricalPrice - currentPrice) / maxHistoricalPrice;

      if (discountPercent < DISCOUNT_THRESHOLD) return null;

      return {
        id: product.id,
        name: product.name,
        currentPrice,
        previousPrice: maxHistoricalPrice,
        discountPercent: Math.round(discountPercent * 100),
        productUrl: product.productUrl,
        clubName: product.club.name,
        leagueName: product.club.league.name,
      };
    })
    .filter(Boolean);

  discounted.sort((a, b) => b!.discountPercent - a!.discountPercent);

  return NextResponse.json(discounted);
}
