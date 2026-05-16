import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const clubs = await prisma.club.findMany({
    where: { deletedAt: null },
    include: { league: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(clubs);
}

export async function POST(req: Request) {
  try {
    const { name, leagueId, officialSiteUrl, officialStoreUrl } = await req.json();
    if (!name?.trim() || !leagueId) {
      return NextResponse.json({ error: 'Name and league are required' }, { status: 400 });
    }
    const parsedLeagueId = parseInt(String(leagueId), 10);
    if (isNaN(parsedLeagueId)) {
      return NextResponse.json({ error: 'Invalid leagueId' }, { status: 400 });
    }
    const club = await prisma.club.create({
      data: {
        name: name.trim(),
        leagueId: parsedLeagueId,
        officialSiteUrl: officialSiteUrl?.trim() ?? '',
        officialStoreUrl: officialStoreUrl?.trim() ?? '',
      },
      include: { league: true },
    });
    return NextResponse.json(club, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
  }
}
