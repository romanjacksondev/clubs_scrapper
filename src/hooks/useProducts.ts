import { useEffect, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  productUrl: string;
  clubId: number;
  updatedAt: string;
}

export function useProducts(clubId: number | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!clubId) {
      setProducts([]);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    fetch(`/api/products?clubId=${clubId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [clubId]);

  return { products, setProducts, loading, error };
}
