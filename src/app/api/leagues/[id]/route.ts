import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leagueId = parseInt(id, 10);
  if (isNaN(leagueId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const existing = await prisma.league.findFirst({
    where: { id: leagueId, deletedAt: null },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'League not found' }, { status: 404 });
  }
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const league = await prisma.league.update({
      where: { id: leagueId },
      data: { name: name.trim() },
    });
    return NextResponse.json(league);
  } catch {
    return NextResponse.json({ error: 'Failed to update league' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leagueId = parseInt(id, 10);
  if (isNaN(leagueId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  try {
    const now = new Date();
    await prisma.product.updateMany({
      where: { club: { leagueId }, deletedAt: null },
      data: { deletedAt: now },
    });
    await prisma.club.updateMany({
      where: { leagueId, deletedAt: null },
      data: { deletedAt: now },
    });
    await prisma.league.update({ where: { id: leagueId }, data: { deletedAt: now } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete league' }, { status: 500 });
  }
}
