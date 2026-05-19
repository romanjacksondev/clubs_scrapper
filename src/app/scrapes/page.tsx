'use client';
import { useEffect, useState } from 'react';

interface RunResult {
  clubName: string;
  status: string;
  count: number | null;
  error: string | null;
}

interface ScrapeRun {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  results: RunResult[];
}

export default function ScrapesPage() {
  const [runs, setRuns] = useState<ScrapeRun[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/scrape-runs')
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized');
        return r.json();
      })
      .then(setRuns)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Scrape Runs</h1>

      {runs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No scrape runs recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const ok = run.results.filter((r) => r.status === 'ok').length;
            const errors = run.results.filter((r) => r.status === 'error').length;
            const empty = run.results.filter((r) => r.status === 'empty').length;
            const totalProducts = run.results.reduce((sum, r) => sum + (r.count ?? 0), 0);
            const duration =
              run.finishedAt != null
                ? Math.round(
                    (new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000,
                  )
                : null;
            const isOpen = expanded === run.id;

            return (
              <div
                key={run.id}
                className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : run.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {new Date(run.startedAt).toLocaleString()}
                    </span>
                    {duration != null ? (
                      <span className="text-xs text-gray-400">{duration}s</span>
                    ) : (
                      <span className="text-xs text-yellow-500">in progress</span>
                    )}
                    <span className="text-xs text-gray-400">{totalProducts} products</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-green-600 dark:text-green-400">✓ {ok}</span>
                    {empty > 0 && <span className="text-yellow-500">⊘ {empty}</span>}
                    {errors > 0 && <span className="text-red-500">✗ {errors}</span>}
                    <span className="text-gray-400 text-base">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-t border-gray-300 dark:border-gray-600 text-sm">
                      <tbody>
                        {run.results.map((r) => (
                          <tr
                            key={r.clubName}
                            className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                          >
                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300 w-1/2">
                              {r.clubName}
                            </td>
                            <td className="px-4 py-2">
                              {r.status === 'ok' && (
                                <span className="text-green-600 dark:text-green-400">
                                  {r.count} products
                                </span>
                              )}
                              {r.status === 'empty' && (
                                <span className="text-yellow-500">empty</span>
                              )}
                              {r.status === 'error' && (
                                <span className="text-red-500 text-xs">{r.error}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
