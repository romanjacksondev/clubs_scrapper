import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const clubs = await prisma.club.findMany({
    include: { league: true },
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(clubs);
}
