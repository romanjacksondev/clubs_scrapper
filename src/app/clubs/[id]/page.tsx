'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  productUrl: string;
  updatedAt: string;
}

export default function ClubProductsPage() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products?clubId=${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load products');
        return r.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="mb-6">
        <Link href="/scrape" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Scrape
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Products</h1>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">No products found for this club.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border-collapse bg-white dark:bg-gray-800 text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Last Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{p.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                    {p.price.toFixed(2)} {p.currency}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={p.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-2 text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
