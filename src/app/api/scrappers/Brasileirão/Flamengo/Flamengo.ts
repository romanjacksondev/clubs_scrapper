import { scrapeVtexStore } from '../../shared/vtexScraper';

// Flamengo official store (VTEX)
// Category 115 = "Mantos" (all jerseys: Jogo 1, Jogo 2, Jogo 3)
export default function scrapeFlamengo() {
  return scrapeVtexStore('https://loja.flamengo.com.br', 115);
}
