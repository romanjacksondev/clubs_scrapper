import { useEffect, useState } from 'react';

export interface League {
  id: number;
  name: string;
}

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    fetch('/api/leagues', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then(setLeagues);
  }, []);

  return leagues;
}
