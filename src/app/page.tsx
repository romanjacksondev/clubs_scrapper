'use client';
import { useEffect, useState } from 'react';

async function fetchLeagues() {
  const res = await fetch('/api/leagues', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function fetchClubs() {
  const res = await fetch('/api/clubs', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default function Home() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchLeagues().then(setLeagues);
    fetchClubs().then(setClubs);
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      const fetchProducts = async () => {
        const res = await fetch(`/api/products?clubId=${selectedClubId}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [selectedClubId]);

  const filteredClubs = selectedLeagueId
    ? clubs.filter((club) => club.leagueId === selectedLeagueId)
    : [];

  const filteredProducts = products;

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10) || null;
    setSelectedLeagueId(id);
    setSelectedClubId(null);
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10) || null;
    setSelectedClubId(id);
  };

  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const handleScrape = async () => {
    if (!selectedLeagueId || !selectedClubId) return;
    setScraping(true);
    setScrapeError('');
    const league = leagues.find((l) => l.id === selectedLeagueId)?.name;
    const club = clubs.find((c) => c.id === selectedClubId)?.name;
    try {
      // const res = await fetch("/api/cron", {
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" }
      // });

      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league, club }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        const err = await res.json();
        setScrapeError(err.error || 'Scraping failed');
      }
    } catch (e) {
      setScrapeError('Scraping failed');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Clubs Scrapper</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Select League
          </label>
          <select
            value={selectedLeagueId || ''}
            onChange={handleLeagueChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a League --</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Select Club
          </label>
          <select
            value={selectedClubId || ''}
            onChange={handleClubChange}
            disabled={!selectedLeagueId}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="">-- Choose a Club --</option>
            {filteredClubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="mb-8 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors w-fit"
        onClick={handleScrape}
        disabled={!selectedLeagueId || !selectedClubId || scraping}
      >
        {scraping ? 'Scraping...' : 'Scrape Products'}
      </button>

      {scrapeError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {scrapeError}
        </div>
      )}

      {selectedClubId && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Products</h2>
          {filteredProducts.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Product Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Price
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => (
                  <tr
                    key={product.id || `${product.name}-${idx}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        View Product
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No products found for this club.</p>
          )}
        </div>
      )}
    </div>
  );
}
