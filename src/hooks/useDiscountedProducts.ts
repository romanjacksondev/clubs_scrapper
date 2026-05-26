import { useCallback, useEffect, useState } from 'react';

export interface DiscountedProduct {
  id: number;
  name: string;
  currentPrice: number;
  previousPrice: number;
  discountPercent: number;
  currency: string;
  productUrl: string;
  clubName: string;
  leagueName: string;
  currentPriceUsd: number | null;
  previousPriceUsd: number | null;
  discountFoundAt: string;
}

export function useDiscountedProducts(minDiscount = 30, adultMaleShirts = false) {
  const [discountedProducts, setDiscountedProducts] = useState<DiscountedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    setLoading(true);
    setError('');
    const url = `/api/discounts?minDiscount=${minDiscount}${adultMaleShirts ? '&adultMaleShirts=true' : ''}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load deals');
        return res.json();
      })
      .then((data) => {
        setDiscountedProducts(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [minDiscount, adultMaleShirts]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { discountedProducts, loading, error, refresh };
}
