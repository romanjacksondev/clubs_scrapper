import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clubId = parseInt(id, 10);
  if (isNaN(clubId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  try {
    const { name, leagueId, officialSiteUrl, officialStoreUrl } = await req.json();
    if (!name?.trim() || !leagueId) {
      return NextResponse.json({ error: 'Name and league are required' }, { status: 400 });
    }
    const club = await prisma.club.update({
      where: { id: clubId },
      data: {
        name: name.trim(),
        leagueId: parseInt(leagueId, 10),
        officialSiteUrl: officialSiteUrl?.trim() ?? '',
        officialStoreUrl: officialStoreUrl?.trim() ?? '',
      },
      include: { league: true },
    });
    return NextResponse.json(club);
  } catch {
    return NextResponse.json({ error: 'Failed to update club' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clubId = parseInt(id, 10);
  if (isNaN(clubId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  try {
    await prisma.product.deleteMany({ where: { clubId } });
    await prisma.club.delete({ where: { id: clubId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 });
  }
}
