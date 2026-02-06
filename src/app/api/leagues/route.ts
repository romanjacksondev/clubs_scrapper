import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const leagues = await prisma.league.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(leagues);
}
