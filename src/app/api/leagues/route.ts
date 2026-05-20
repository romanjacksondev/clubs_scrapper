import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const leagues = await prisma.league.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(leagues);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const league = await prisma.league.create({ data: { name: name.trim() } });
    return NextResponse.json(league, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create league' }, { status: 500 });
  }
}
