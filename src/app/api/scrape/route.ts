import { NextRequest, NextResponse } from 'next/server';

import { processProducts, purgeOldHistory } from './productsProcessor';
import { launchScrapper } from './scrapperLauncher';

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
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
    const products = await processProducts(data, parseInt(clubId, 10));
    await purgeOldHistory();
    return NextResponse.json({ products });
  } catch (e) {
    console.error('Scrapper error:', e);
    const error = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json(
      { error: 'Scrapper not found or failed', details: error.message, stack: error.stack },
      { status: 500 },
    );
  }
}
