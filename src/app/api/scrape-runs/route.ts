import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const runs = await prisma.scrapeRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 30,
    include: {
      results: { orderBy: { clubName: 'asc' } },
    },
  });

  return NextResponse.json(runs);
}
