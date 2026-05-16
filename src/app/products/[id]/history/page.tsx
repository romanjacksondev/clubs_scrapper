'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../../../lib/formatPrice';

interface HistoryEntry {
  price: number;
  recordedAt: string;
}

interface ProductDetail {
  id: number;
  name: string;
  currentPrice: number;
  currency: string;
  productUrl: string;
  clubName: string;
  leagueName: string;
  updatedAt: string;
  history: HistoryEntry[];
}

export default function ProductHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}/history`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-red-600">{error || 'Product not found'}</p>
        <Link href="/scrape" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Scrape
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 w-full">
      <Link
        href="/scrape"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        ← Back to Scrape
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{product.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {product.leagueName} — {product.clubName}
      </p>

      <div className="flex items-center gap-6 mb-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Current Price
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(product.currentPrice, product.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Last Scraped
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(product.updatedAt).toLocaleString()}
          </p>
        </div>
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          View Product
        </a>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Price History</h2>

      {product.history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No price history recorded yet.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Date
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {product.history.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                  {new Date(entry.recordedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                  {formatPrice(entry.price, product.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
