import { NextRequest, NextResponse } from 'next/server';

import { auth } from '../../../auth';
import { prisma } from '../../../lib/prisma';
import { processProducts } from './productsProcessor';
import { launchScrapper } from './scrapperLauncher';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let league: unknown, club: unknown, clubId: unknown;
  try {
    ({ league, club, clubId } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!league || !club || !clubId) {
    return NextResponse.json({ error: 'Missing league, club or clubId' }, { status: 400 });
  }
  if (typeof league !== 'string' || typeof club !== 'string') {
    return NextResponse.json({ error: 'league and club must be strings' }, { status: 400 });
  }

  const parsedClubId = parseInt(String(clubId), 10);
  if (isNaN(parsedClubId)) {
    return NextResponse.json({ error: 'Invalid clubId' }, { status: 400 });
  }
  const clubRecord = await prisma.club.findFirst({
    where: { id: parsedClubId, deletedAt: null },
    select: { id: true },
  });
  if (!clubRecord) {
    return NextResponse.json({ error: 'Club not found' }, { status: 404 });
  }

  // Remove spaces and dots for folder/file matching (e.g. "1. FC Heidenheim" → "1FCHeidenheim")
  const trimmedLeague = league.replace(/[\s.]+/g, '');
  const trimmedClub = club.replace(/[\s.]+/g, '');
  console.log('Launching scrapper for:', { trimmedLeague, trimmedClub });

  // Dynamically import the scrapper based on league and club
  try {
    const scrapper = await launchScrapper(trimmedLeague, trimmedClub);
    const data = await scrapper();
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Scrapper returned no products — DB not updated to avoid data loss' },
        { status: 422 },
      );
    }
    const products = await processProducts(data, parsedClubId);
    return NextResponse.json({ products });
  } catch (e) {
    console.error('Scrapper error:', e);
    const error = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json(
      {
        error: 'Scrapper not found or failed',
        ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
      },
      { status: 500 },
    );
  }
}
