import { NextResponse } from 'next/server';

import { processProducts, purgeOldHistory } from './productsProcessor';
import { launchScrapper } from './scrapperLauncher';

export async function POST(request: {
  json: () =>
    | PromiseLike<{ league: any; club: any; clubId: any }>
    | { league: any; club: any; clubId: any };
}) {
  let { league, club, clubId } = await request.json();
  // Remove spaces for folder/file matching
  const trimmedLeague = league.replace(/\s+/g, '');
  const trimmedClub = club.replace(/\s+/g, '');
  console.log('Launching scrapper for:', { trimmedLeague, trimmedClub });
  if (!league || !club || !clubId) {
    return NextResponse.json({ error: 'Missing league, club or clubId' }, { status: 400 });
  }

  // Dynamically import the scrapper based on league and club
  try {
    const scrapper = await launchScrapper(trimmedLeague, trimmedClub);
    const data = await scrapper();
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
