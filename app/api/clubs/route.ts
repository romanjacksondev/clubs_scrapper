import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const clubs = await prisma.club.findMany({
    include: { league: true },
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(clubs);
}
