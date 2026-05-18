// Huracán official store (tiendahuracan.com.ar).
// The store is currently unreachable (DNS / server offline).
// This scraper returns an empty array until the store is accessible.
// TODO: Determine the store platform (VTEX / Tiendanube / other) once
//       tiendahuracan.com.ar comes online and implement full scraping logic.

import { Product } from '../../shared/Product';

export default async function scrapeHuracán(): Promise<Product[]> {
  return [];
}
