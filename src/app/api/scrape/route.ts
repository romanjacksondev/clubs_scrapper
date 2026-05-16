import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../lib/prisma';
import { processProducts } from './productsProcessor';
import { launchScrapper } from './scrapperLauncher';

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  if (cronSecret) {
    const incomingSecret = request.headers.get('x-cron-secret');
    if (incomingSecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const { league, club, clubId } = await request.json();
  if (!league || !club || !clubId) {
    return NextResponse.json({ error: 'Missing league, club or clubId' }, { status: 400 });
  }

  const parsedClubId = parseInt(clubId, 10);
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

  // Remove spaces for folder/file matching
  const trimmedLeague = (league as string).replace(/\s+/g, '');
  const trimmedClub = (club as string).replace(/\s+/g, '');
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
