import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../lib/prisma';
import { processProducts, purgeOldHistory } from '../scrape/productsProcessor';
import { launchScrapper } from '../scrape/scrapperLauncher';

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: CRON_SECRET not set' },
      { status: 500 },
    );
  }
  const incomingSecret = request.headers.get('x-cron-secret');
  if (incomingSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clubs = await prisma.club.findMany({
    where: { deletedAt: null },
    include: { league: true },
  });

  const results: {
    club: string;
    status: 'ok' | 'empty' | 'error';
    count?: number;
    error?: string;
  }[] = [];

  for (const club of clubs) {
    const trimmedLeague = club.league.name.replace(/\s+/g, '');
    const trimmedClub = club.name.replace(/\s+/g, '');
    try {
      const scrapper = await launchScrapper(trimmedLeague, trimmedClub);
      const data = await scrapper();
      if (data.length === 0) {
        results.push({ club: club.name, status: 'empty', error: 'No products returned' });
        continue;
      }
      const products = await processProducts(data, club.id);
      results.push({ club: club.name, status: 'ok', count: products.length });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ club: club.name, status: 'error', error: msg });
    }
  }

  await purgeOldHistory();
  return NextResponse.json({ results });
}
