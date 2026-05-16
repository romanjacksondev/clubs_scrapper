'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDiscountedProducts } from '../hooks/useDiscountedProducts';
import { formatPrice } from '../lib/formatPrice';

export default function Home() {
  const [minDiscount, setMinDiscount] = useState(30);
  const [debouncedDiscount, setDebouncedDiscount] = useState(30);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedDiscount(minDiscount), 400);
    return () => clearTimeout(t);
  }, [minDiscount]);

  const { discountedProducts, loading: loadingDiscounts } =
    useDiscountedProducts(debouncedDiscount);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Clubs Scrapper</h1>
        <Link
          href="/scrape"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Scrape Products
        </Link>
      </div>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔥 Deals
            {(loadingDiscounts || minDiscount !== debouncedDiscount) && (
              <span className="ml-3 text-sm font-normal text-gray-400 dark:text-gray-500">
                loading…
              </span>
            )}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Min. discount</span>
            <input
              type="range"
              min="5"
              max="70"
              step="5"
              value={minDiscount}
              onChange={(e) => setMinDiscount(parseInt(e.target.value, 10))}
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((minDiscount - 5) / 65) * 100}%, #374151 ${((minDiscount - 5) / 65) * 100}%, #374151 100%)`,
              }}
              className="w-56 h-2 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-16">
              {minDiscount}%
            </span>
          </div>
        </div>
        {loadingDiscounts ? (
          <p className="text-gray-500 dark:text-gray-400">Loading deals...</p>
        ) : discountedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    League
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Club
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Product
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Was
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Now
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Discount
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {discountedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      {product.leagueName}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      {product.clubName}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.previousPrice, product.currency)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-green-700 dark:text-green-400 font-semibold">
                      {formatPrice(product.currentPrice, product.currency)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <span className="inline-block bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs font-bold px-2 py-1 rounded">
                        -{product.discountPercent}%
                      </span>
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
                        <Link
                          href={`/products/${product.id}/history`}
                          className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm"
                        >
                          History
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No deals found yet.{' '}
            <Link href="/scrape" className="text-blue-600 dark:text-blue-400 hover:underline">
              Scrape a club
            </Link>{' '}
            to start tracking prices.
          </p>
        )}
      </section>
    </div>
  );
}
