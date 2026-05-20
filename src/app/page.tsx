import Link from 'next/link';
import DealsSection from '../components/DealsSection';

export default function Home() {
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
      <DealsSection />
    </div>
  );
}
