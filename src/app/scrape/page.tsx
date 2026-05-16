'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useClubs } from '../../hooks/useClubs';
import { useLeagues } from '../../hooks/useLeagues';
import { useProducts } from '../../hooks/useProducts';
import { useScrape } from '../../hooks/useScrape';
import { formatPrice } from '../../lib/formatPrice';

export default function ScrapePage() {
  const leagues = useLeagues();
  const clubs = useClubs();
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const { products, setProducts } = useProducts(selectedClubId);

  const { scraping, scrapeError, scrape } = useScrape((scraped) => {
    setProducts(scraped);
  });

  const filteredClubs = selectedLeagueId
    ? clubs.filter((club) => club.leagueId === selectedLeagueId)
    : [];

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeagueId(parseInt(e.target.value, 10) || null);
    setSelectedClubId(null);
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClubId(parseInt(e.target.value, 10) || null);
  };

  const handleScrape = () => {
    scrape({
      leagueId: selectedLeagueId,
      clubId: selectedClubId,
      leagueName: leagues.find((l) => l.id === selectedLeagueId)?.name,
      clubName: clubs.find((c) => c.id === selectedClubId)?.name,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Scrape Products</h1>

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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Products for{' '}
            <span className="text-blue-600 dark:text-blue-400">
              {clubs.find((c) => c.id === selectedClubId)?.name}
            </span>
          </h2>
          {products.length > 0 ? (
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
                    Last Scraped
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product.id || `${product.name}-${idx}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">
                      {formatPrice(product.price, product.currency)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '—'}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <div className="flex gap-3">
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                        >
                          View
                        </a>
                        {product.id && (
                          <Link
                            href={`/products/${product.id}/history`}
                            className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm"
                          >
                            History
                          </Link>
                        )}
                      </div>
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
