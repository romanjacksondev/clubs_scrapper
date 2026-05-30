import scrapeBirminghamCity from '../src/app/api/scrappers/EFL/BirminghamCity/BirminghamCity';
import scrapeBlackburnRovers from '../src/app/api/scrappers/EFL/BlackburnRovers/BlackburnRovers';
import scrapeBristolCity from '../src/app/api/scrappers/EFL/BristolCity/BristolCity';
import scrapeCardiffCity from '../src/app/api/scrappers/EFL/CardiffCity/CardiffCity';
import scrapeCharltonAthletic from '../src/app/api/scrappers/EFL/CharltonAthletic/CharltonAthletic';
import scrapeCoventryCity from '../src/app/api/scrappers/EFL/CoventryCity/CoventryCity';
import scrapeDerbyCounty from '../src/app/api/scrappers/EFL/DerbyCounty/DerbyCounty';
import scrapeHullCity from '../src/app/api/scrappers/EFL/HullCity/HullCity';
import scrapeIpswichTown from '../src/app/api/scrappers/EFL/IpswichTown/IpswichTown';
import scrapeLeicesterCity from '../src/app/api/scrappers/EFL/LeicesterCity/LeicesterCity';
import scrapeMiddlesbrough from '../src/app/api/scrappers/EFL/Middlesbrough/Middlesbrough';
import scrapeMillwallFC from '../src/app/api/scrappers/EFL/MillwallFC/MillwallFC';
import scrapeNorwichCity from '../src/app/api/scrappers/EFL/NorwichCity/NorwichCity';
import scrapeOxfordUnited from '../src/app/api/scrappers/EFL/OxfordUnited/OxfordUnited';
import scrapePortsmouthFC from '../src/app/api/scrappers/EFL/PortsmouthFC/PortsmouthFC';
import scrapePrestonNE from '../src/app/api/scrappers/EFL/PrestonNE/PrestonNE';
import scrapeQPR from '../src/app/api/scrappers/EFL/QPR/QPR';
import scrapeSouthamptonFC from '../src/app/api/scrappers/EFL/SouthamptonFC/SouthamptonFC';
import scrapeStokeCity from '../src/app/api/scrappers/EFL/StokeCity/StokeCity';
import scrapeSwanseaCity from '../src/app/api/scrappers/EFL/SwanseaCity/SwanseaCity';
import scrapeWatfordFC from '../src/app/api/scrappers/EFL/WatfordFC/WatfordFC';
import scrapeWestBromwichAlbion from '../src/app/api/scrappers/EFL/WestBromwichAlbion/WestBromwichAlbion';
import scrapeWrexhamAFC from '../src/app/api/scrappers/EFL/WrexhamAFC/WrexhamAFC';

const scrapers: [string, () => Promise<unknown[]>][] = [
  ['BirminghamCity', scrapeBirminghamCity],
  ['BlackburnRovers', scrapeBlackburnRovers],
  ['BristolCity', scrapeBristolCity],
  ['CardiffCity', scrapeCardiffCity],
  ['CharltonAthletic', scrapeCharltonAthletic],
  ['CoventryCity', scrapeCoventryCity],
  ['DerbyCounty', scrapeDerbyCounty],
  ['HullCity', scrapeHullCity],
  ['IpswichTown', scrapeIpswichTown],
  ['LeicesterCity', scrapeLeicesterCity],
  ['Middlesbrough', scrapeMiddlesbrough],
  ['MillwallFC', scrapeMillwallFC],
  ['NorwichCity', scrapeNorwichCity],
  ['OxfordUnited', scrapeOxfordUnited],
  ['PortsmouthFC', scrapePortsmouthFC],
  ['PrestonNE', scrapePrestonNE],
  ['QPR', scrapeQPR],
  ['SouthamptonFC', scrapeSouthamptonFC],
  ['StokeCity', scrapeStokeCity],
  ['SwanseaCity', scrapeSwanseaCity],
  ['WatfordFC', scrapeWatfordFC],
  ['WestBromwichAlbion', scrapeWestBromwichAlbion],
  ['WrexhamAFC', scrapeWrexhamAFC],
];

async function main() {
  for (const [name, scraper] of scrapers) {
    process.stdout.write(`Testing ${name}... `);
    try {
      const products = await scraper();
      console.log(`${products.length} products`);
      if (products.length > 0) {
        const p = products[0] as { name?: string; price?: number; currency?: string };
        console.log(`  Sample: ${p.name} — ${p.price} ${p.currency}`);
      }
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  }
}

main();
