import { useEffect, useState } from 'react';

export interface Club {
  id: number;
  name: string;
  leagueId: number;
}

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clubs', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load clubs');
        return res.json();
      })
      .then(setClubs)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { clubs, loading, error };
}
