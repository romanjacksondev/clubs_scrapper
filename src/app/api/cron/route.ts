import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../lib/prisma';
import { processProducts, purgeOldHistory } from '../scrape/productsProcessor';
import { launchScrapper } from '../scrape/scrapperLauncher';

const SCRAPER_TIMEOUT_MS = 60_000;

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

  type Result = { club: string; status: 'ok' | 'empty' | 'error'; count?: number; error?: string };

  const settled = await Promise.allSettled(
    clubs.map(async (club): Promise<Result> => {
      const trimmedLeague = club.league.name.replace(/[\s.]+/g, '');
      const trimmedClub = club.name.replace(/[\s.]+/g, '');
      const data = await Promise.race([
        (async () => {
          const scrapper = await launchScrapper(trimmedLeague, trimmedClub);
          return scrapper();
        })(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Timed out after ${SCRAPER_TIMEOUT_MS / 1000}s`)),
            SCRAPER_TIMEOUT_MS,
          ),
        ),
      ]);
      if (data.length === 0) {
        return { club: club.name, status: 'empty', error: 'No products returned' };
      }
      const products = await processProducts(data, club.id);
      return { club: club.name, status: 'ok', count: products.length };
    }),
  );

  const results: Result[] = settled.map((s, i) =>
    s.status === 'fulfilled'
      ? s.value
      : {
          club: clubs[i].name,
          status: 'error',
          error: s.reason instanceof Error ? s.reason.message : String(s.reason),
        },
  );

  await purgeOldHistory();
  return NextResponse.json({ results });
}
