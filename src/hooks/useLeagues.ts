import { useEffect, useState } from 'react';

export interface League {
  id: number;
  name: string;
}

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/leagues', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load leagues');
        return res.json();
      })
      .then(setLeagues)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { leagues, loading, error };
}
