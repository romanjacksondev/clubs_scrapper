import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      history: { orderBy: { recordedAt: 'desc' } },
      club: { include: { league: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    currentPrice: product.price,
    currency: product.currency,
    productUrl: product.productUrl,
    clubName: product.club.name,
    leagueName: product.club.league.name,
    updatedAt: product.updatedAt,
    history: product.history.map((h) => ({
      price: h.price,
      currency: h.currency,
      recordedAt: h.recordedAt,
    })),
  });
}
