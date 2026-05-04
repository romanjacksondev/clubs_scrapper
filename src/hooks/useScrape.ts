import { useState } from 'react';
import { Product } from './useProducts';

interface ScrapeParams {
  leagueId: number | null;
  clubId: number | null;
  leagueName: string | undefined;
  clubName: string | undefined;
}

export function useScrape(onSuccess: (products: Product[]) => void) {
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const scrape = async ({ leagueId, clubId, leagueName, clubName }: ScrapeParams) => {
    if (!leagueId || !clubId || !leagueName || !clubName) return;
    setScraping(true);
    setScrapeError('');
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league: leagueName, club: clubName }),
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.products || []);
      } else {
        const err = await res.json();
        setScrapeError(err.error || 'Scraping failed');
      }
    } catch {
      setScrapeError('Scraping failed');
    } finally {
      setScraping(false);
    }
  };

  return { scraping, scrapeError, scrape };
}
