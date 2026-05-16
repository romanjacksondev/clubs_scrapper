import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');

  if (!clubId) {
    return NextResponse.json([]);
  }
  const parsedClubId = parseInt(clubId, 10);
  if (isNaN(parsedClubId)) {
    return NextResponse.json({ error: 'Invalid clubId' }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { clubId: parsedClubId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(products);
}
