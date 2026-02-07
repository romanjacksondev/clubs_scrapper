import { NextResponse } from 'next/server';

import { processProducts } from './productsProcessor';
import { launchScrapper } from './scrapperLauncher';

export async function POST(request: {
  json: () => PromiseLike<{ league: any; club: any }> | { league: any; club: any };
}) {
  let { league, club } = await request.json();
  // Remove spaces for folder/file matching
  const trimmedLeague = league.replace(/\s+/g, '');
  const trimmedClub = club.replace(/\s+/g, '');
  console.log('Launching scrapper for:', { trimmedLeague, trimmedClub });
  if (!league || !club) {
    return NextResponse.json({ error: 'Missing league or club' }, { status: 400 });
  }

  // Dynamically import the scrapper based on league and club
  try {
    const scrapper = await launchScrapper(trimmedLeague, trimmedClub);
    const data = await scrapper();
    await processProducts(data, club);
    return NextResponse.json({ products: data });
  } catch (e) {
    console.error('Scrapper error:', e);
    const error = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json(
      { error: 'Scrapper not found or failed', details: error.message, stack: error.stack },
      { status: 500 },
    );
  }
}
