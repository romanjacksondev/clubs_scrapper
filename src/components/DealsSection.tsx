'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useDiscountedProducts } from '../hooks/useDiscountedProducts';
import { formatPrice } from '../lib/formatPrice';

type SortCol = 'league' | 'club' | 'discount' | 'usd' | 'date';

type ProductGroup = {
  key: string;
  clubName: string;
  leagueName: string;
  products: ReturnType<typeof useDiscountedProducts>['discountedProducts'];
  bestDiscount: number;
  lowestUsdPrice: number | null;
  latestFoundAt: string;
};

function formatFoundDate(value: string) {
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getGroupComparator(sortCol: SortCol | null, sortDir: 'asc' | 'desc') {
  return (a: ProductGroup, b: ProductGroup) => {
    let cmp = 0;

    if (sortCol === 'league') cmp = a.leagueName.localeCompare(b.leagueName);
    else if (sortCol === 'club') cmp = a.clubName.localeCompare(b.clubName);
    else if (sortCol === 'discount') cmp = a.bestDiscount - b.bestDiscount;
    else if (sortCol === 'usd')
      cmp = (a.lowestUsdPrice ?? Infinity) - (b.lowestUsdPrice ?? Infinity);
    else cmp = new Date(a.latestFoundAt).getTime() - new Date(b.latestFoundAt).getTime();

    return sortDir === 'asc' ? cmp : -cmp;
  };
}

export default function DealsSection() {
  const [minDiscount, setMinDiscount] = useState(30);
  const [debouncedDiscount, setDebouncedDiscount] = useState(30);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedDiscount(minDiscount), 400);
    return () => clearTimeout(t);
  }, [minDiscount]);

  const [sortCol, setSortCol] = useState<SortCol | null>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [adultMaleShirts, setAdultMaleShirts] = useState(false);

  function resetFilters() {
    setMinDiscount(30);
    setSelectedLeague('');
    setSelectedClub('');
    setSearchQuery('');
    setAdultMaleShirts(false);
  }

  const isFiltered =
    minDiscount !== 30 ||
    selectedLeague !== '' ||
    selectedClub !== '' ||
    searchQuery !== '' ||
    adultMaleShirts;

  const { discountedProducts, loading } = useDiscountedProducts(debouncedDiscount, adultMaleShirts);

  const leagues = useMemo(
    () => [...new Set(discountedProducts.map((p) => p.leagueName))].sort(),
    [discountedProducts],
  );

  const clubs = useMemo(() => {
    const source = selectedLeague
      ? discountedProducts.filter((p) => p.leagueName === selectedLeague)
      : discountedProducts;
    return [...new Set(source.map((p) => p.clubName))].sort();
  }, [discountedProducts, selectedLeague]);

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  function sortIndicator(col: SortCol) {
    return sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';
  }

  const sortOptions: { key: SortCol; label: string }[] = [
    { key: 'date', label: 'Found' },
    { key: 'discount', label: 'Discount' },
    { key: 'usd', label: '~USD' },
    { key: 'league', label: 'League' },
    { key: 'club', label: 'Club' },
  ];

  const controlBaseClass =
    'h-12 w-full rounded-xl border border-slate-600/70 bg-slate-800/90 pr-4 pl-11 text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  const activeFilterCount =
    Number(minDiscount !== 30) +
    Number(selectedLeague !== '') +
    Number(selectedClub !== '') +
    Number(searchQuery !== '') +
    Number(adultMaleShirts);

  const filteredProducts = useMemo(() => {
    let list = selectedLeague
      ? discountedProducts.filter((p) => p.leagueName === selectedLeague)
      : discountedProducts;
    if (selectedClub) {
      list = list.filter((p) => p.clubName === selectedClub);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.clubName.toLowerCase().includes(q),
      );
    }
    if (sortCol) {
      list = [...list].sort((a, b) => {
        let cmp = 0;
        if (sortCol === 'league') cmp = a.leagueName.localeCompare(b.leagueName);
        else if (sortCol === 'club') cmp = a.clubName.localeCompare(b.clubName);
        else if (sortCol === 'discount') cmp = a.discountPercent - b.discountPercent;
        else if (sortCol === 'usd')
          cmp = (a.currentPriceUsd ?? Infinity) - (b.currentPriceUsd ?? Infinity);
        else if (sortCol === 'date')
          cmp = new Date(a.discountFoundAt).getTime() - new Date(b.discountFoundAt).getTime();
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [discountedProducts, selectedLeague, selectedClub, searchQuery, sortCol, sortDir]);

  const groupedProducts = useMemo(() => {
    const groups = new Map<string, ProductGroup>();

    filteredProducts.forEach((product) => {
      const key = `${product.leagueName}::${product.clubName}`;
      const existing = groups.get(key);

      if (existing) {
        existing.products.push(product);
        existing.bestDiscount = Math.max(existing.bestDiscount, product.discountPercent);
        existing.lowestUsdPrice =
          existing.lowestUsdPrice == null
            ? product.currentPriceUsd
            : product.currentPriceUsd == null
              ? existing.lowestUsdPrice
              : Math.min(existing.lowestUsdPrice, product.currentPriceUsd);
        if (
          new Date(product.discountFoundAt).getTime() > new Date(existing.latestFoundAt).getTime()
        ) {
          existing.latestFoundAt = product.discountFoundAt;
        }
        return;
      }

      groups.set(key, {
        key,
        clubName: product.clubName,
        leagueName: product.leagueName,
        products: [product],
        bestDiscount: product.discountPercent,
        lowestUsdPrice: product.currentPriceUsd,
        latestFoundAt: product.discountFoundAt,
      });
    });

    return [...groups.values()].sort(getGroupComparator(sortCol, sortDir));
  }, [filteredProducts, sortCol, sortDir]);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          🔥 Deals
          {(loading || minDiscount !== debouncedDiscount) && (
            <span className="ml-3 text-sm font-normal text-gray-400 dark:text-gray-500">
              loading…
            </span>
          )}
        </h2>

        <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 p-5 shadow-[0_10px_40px_rgba(2,6,23,0.45)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Filters</p>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                activeFilterCount > 0
                  ? 'border-blue-400/40 bg-blue-500/20 text-blue-100'
                  : 'border-slate-600/70 bg-slate-800/80 text-slate-300'
              }`}
            >
              {activeFilterCount > 0 ? `${activeFilterCount} active` : 'All defaults'}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(260px,360px)_auto_1fr] lg:items-center">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
                Min. discount
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="70"
                  step="5"
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(parseInt(e.target.value, 10))}
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((minDiscount - 5) / 65) * 100}%, #334155 ${((minDiscount - 5) / 65) * 100}%, #334155 100%)`,
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-500"
                />
                <span className="w-16 text-right text-4xl font-bold leading-none text-blue-400">
                  {minDiscount}%
                </span>
              </div>
            </div>

            <div className="h-14 w-px justify-self-center bg-slate-700/80 hidden lg:block" />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  🏆
                </span>
                <select
                  value={selectedLeague}
                  onChange={(e) => {
                    setSelectedLeague(e.target.value);
                    setSelectedClub('');
                  }}
                  className={controlBaseClass}
                >
                  <option value="">All leagues</option>
                  {leagues.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  🛡️
                </span>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className={controlBaseClass}
                >
                  <option value="">All clubs</option>
                  {clubs.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setAdultMaleShirts((v) => !v)}
                className={`h-12 rounded-xl border px-4 text-sm font-semibold transition-all ${
                  adultMaleShirts
                    ? 'border-blue-400 bg-blue-500/20 text-blue-100 shadow-[0_0_0_1px_rgba(96,165,250,0.35)]'
                    : 'border-slate-600/70 bg-slate-800/90 text-slate-100 hover:border-blue-500/60'
                }`}
              >
                👕 Men&apos;s shirts
              </button>

              {isFiltered ? (
                <button
                  onClick={resetFilters}
                  className="h-12 rounded-xl border border-rose-400/50 bg-rose-950/20 px-4 text-sm font-semibold text-rose-200 transition-colors hover:border-rose-300 hover:bg-rose-900/30"
                >
                  ✕ Reset filters
                </button>
              ) : (
                <div className="h-12 rounded-xl border border-slate-700/70 bg-slate-800/60 px-4 text-sm font-medium text-slate-400 flex items-center">
                  No active filters
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-center">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                🔎
              </span>
              <input
                type="search"
                placeholder="Search product or club…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={controlBaseClass}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs uppercase tracking-[0.12em] text-slate-400">
                Sort groups by
              </span>
              {sortOptions.map((option) => {
                const active = sortCol === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleSort(option.key)}
                    className={`h-11 rounded-full border px-5 text-sm font-semibold transition-all ${
                      active
                        ? 'border-blue-400 bg-blue-500/20 text-blue-100 shadow-[0_0_0_1px_rgba(96,165,250,0.35)]'
                        : 'border-slate-600/70 bg-slate-800/90 text-slate-200 hover:border-blue-500/60'
                    }`}
                  >
                    {option.label}
                    {sortIndicator(option.key)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading deals...</p>
      ) : discountedProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No deals found yet.{' '}
          <Link href="/scrape" className="text-blue-600 dark:text-blue-400 hover:underline">
            Scrape a club
          </Link>{' '}
          to start tracking prices.
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No deals match your filters.</p>
      ) : (
        <div className="space-y-4">
          {groupedProducts.map((group, groupIndex) => (
            <details
              key={group.key}
              open={groupIndex === 0}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-900"
            >
              <summary className="flex cursor-pointer list-none flex-col gap-4 px-5 py-4 marker:hidden md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {group.leagueName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {group.products.length} product{group.products.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {group.clubName}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 md:text-right">
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Best discount</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      -{group.bestDiscount}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Lowest USD</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {group.lowestUsdPrice != null
                        ? formatPrice(group.lowestUsdPrice, 'USD')
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Latest found</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatFoundDate(group.latestFoundAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-start md:justify-end">
                    <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 transition-colors group-open:border-blue-200 group-open:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:group-open:border-blue-900 dark:group-open:text-blue-300">
                      {groupIndex === 0 ? 'Open by default' : 'Expand team'}
                    </span>
                  </div>
                </div>
              </summary>

              <div className="border-t border-gray-200 bg-gray-50/70 px-5 py-5 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="grid gap-4 lg:grid-cols-2">
                  {group.products.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:h-24 sm:w-24 dark:border-gray-700 dark:bg-gray-800">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                              <span className="text-base">📦</span>
                              <span>No image</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                {product.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Found {formatFoundDate(product.discountFoundAt)}
                              </p>
                            </div>
                            <span className="inline-flex shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                              -{product.discountPercent}%
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <p className="text-gray-400 dark:text-gray-500">Was</p>
                              <p className="line-through text-gray-500 dark:text-gray-400">
                                {formatPrice(product.previousPrice, product.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 dark:text-gray-500">Now</p>
                              <p className="font-semibold text-green-700 dark:text-green-400">
                                {formatPrice(product.currentPrice, product.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 dark:text-gray-500">~USD</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {product.currentPriceUsd != null
                                  ? formatPrice(product.currentPriceUsd, 'USD')
                                  : '—'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <a
                              href={product.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                            >
                              View product
                            </a>
                            <Link
                              href={`/products/${product.id}/history`}
                              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-purple-400 hover:text-purple-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-purple-500 dark:hover:text-purple-300"
                            >
                              History
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
