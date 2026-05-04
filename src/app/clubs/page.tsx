import ClubsManager from '@/components/ClubsManager';

export default function ClubsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Clubs</h1>
      <ClubsManager />
    </div>
  );
}
