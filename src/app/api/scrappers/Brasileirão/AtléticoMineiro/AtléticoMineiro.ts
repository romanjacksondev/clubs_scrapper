import { scrapeVtexStore } from '../../shared/vtexScraper';

// Atlético Mineiro official store — Loja do Galo (lojadogalo.com.br — VTEX)
// Category 42 = "Camisa de Jogo" (sub-categories: Jogo 1, Jogo 2, Jogo 3)
export default function scrapeAtleticoMineiro() {
  return scrapeVtexStore('https://www.lojadogalo.com.br', 42);
}
