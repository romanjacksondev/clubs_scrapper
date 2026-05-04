import { useEffect, useState } from 'react';

export interface Club {
  id: number;
  name: string;
  leagueId: number;
}

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetch('/api/clubs', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then(setClubs);
  }, []);

  return clubs;
}
