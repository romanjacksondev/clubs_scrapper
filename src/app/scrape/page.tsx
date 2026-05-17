'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ClubStat {
  id: number;
  name: string;
  leagueId: number;
  leagueName: string;
  productCount: number;
  lastScrapedAt: string | null;
}

type ScrapeStatus =
  | { status: 'scraping' }
  | { status: 'done'; count: number }
  | { status: 'error'; error: string };

export default function ScrapePage() {
  const [clubs, setClubs] = useState<ClubStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrapeStates, setScrapeStates] = useState<Record<number, ScrapeStatus>>({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/clubs/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load clubs');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setClubs(data);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleScrape(club: ClubStat) {
    setScrapeStates((prev) => ({ ...prev, [club.id]: { status: 'scraping' } }));
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league: club.leagueName, club: club.name, clubId: club.id }),
      });
      const data = await res.json();
      if (res.ok) {
        const count: number = data.products?.length ?? 0;
        setScrapeStates((prev) => ({ ...prev, [club.id]: { status: 'done', count } }));
        setClubs((prev) =>
          prev.map((c) =>
            c.id === club.id
              ? { ...c, productCount: count, lastScrapedAt: new Date().toISOString() }
              : c,
          ),
        );
      } else {
        setScrapeStates((prev) => ({
          ...prev,
          [club.id]: { status: 'error', error: data.error ?? 'Failed' },
        }));
      }
    } catch {
      setScrapeStates((prev) => ({
        ...prev,
        [club.id]: { status: 'error', error: 'Network error' },
      }));
    }
  }

  const grouped = clubs.reduce<Record<string, ClubStat[]>>((acc, club) => {
    (acc[club.leagueName] ??= []).push(club);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Scrape Products</h1>

      {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading clubs...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">League</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">Club</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-center">
                  Products
                </th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  Last Scraped
                </th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">Result</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(grouped).map(([leagueName, leagueClubs]) =>
                leagueClubs.map((club, idx) => {
                  const state = scrapeStates[club.id];
                  return (
                    <tr
                      key={club.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {idx === 0 ? (
                        <td
                          rowSpan={leagueClubs.length}
                          className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 align-top border-r border-gray-100 dark:border-gray-700 whitespace-nowrap"
                        >
                          {leagueName}
                        </td>
                      ) : null}
                      <td className="px-4 py-3 whitespace-nowrap">{club.name}</td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        <Link
                          href={`/clubs/${club.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {club.productCount}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {club.lastScrapedAt ? new Date(club.lastScrapedAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        {state?.status === 'done' && (
                          <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
                            ✓ {state.count} products
                          </span>
                        )}
                        {state?.status === 'error' && (
                          <span
                            className="text-red-600 dark:text-red-400 break-words"
                            title={state.error}
                          >
                            ✗ {state.error}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleScrape(club)}
                          disabled={state?.status === 'scraping'}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                          {state?.status === 'scraping' ? 'Scraping…' : 'Scrape'}
                        </button>
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
