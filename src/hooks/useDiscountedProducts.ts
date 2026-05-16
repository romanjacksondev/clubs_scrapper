import { useEffect, useState } from 'react';

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
}

export function useDiscountedProducts() {
  const [discountedProducts, setDiscountedProducts] = useState<DiscountedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    fetch('/api/discounts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setDiscountedProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { discountedProducts, loading, refresh };
}
