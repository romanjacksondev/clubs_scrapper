import LeaguesManager from '@/components/LeaguesManager';

export default function LeaguesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Leagues</h1>
      <LeaguesManager />
    </div>
  );
}
