import { scrapeVtexStore } from '../../shared/vtexScraper';

// Grêmio official store — Grêmio Mania (loja.gremiomania.com.br — VTEX)
// Category 33 = "UNIFORMES OFICIAIS" (sub-categories: Uniforme I, II, III)
export default function scrapeGremio() {
  return scrapeVtexStore('https://loja.gremiomania.com.br', 33);
}
