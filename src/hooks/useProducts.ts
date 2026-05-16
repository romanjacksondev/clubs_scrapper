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

  useEffect(() => {
    if (!clubId) {
      setProducts([]);
      return;
    }
    fetch(`/api/products?clubId=${clubId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts);
  }, [clubId]);

  return { products, setProducts };
}
