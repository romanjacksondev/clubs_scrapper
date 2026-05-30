import scrapeAlaves from '../src/app/api/scrappers/LaLiga/Alavés/Alavés';
import scrapeGetafe from '../src/app/api/scrappers/LaLiga/Getafe/Getafe';
import scrapeOsasuna from '../src/app/api/scrappers/LaLiga/Osasuna/Osasuna';
import scrapeRayo from '../src/app/api/scrappers/LaLiga/RayoVallecano/RayoVallecano';
import scrapeRealSociedad from '../src/app/api/scrappers/LaLiga/RealSociedad/RealSociedad';

const scrapers: Record<string, () => Promise<unknown[]>> = {
  rayo: scrapeRayo,
  getafe: scrapeGetafe,
  alaves: scrapeAlaves,
  realsociedad: scrapeRealSociedad,
  osasuna: scrapeOsasuna,
};

const [, , scraper = 'rayo'] = process.argv;

async function main() {
  const fn = scrapers[scraper];
  if (!fn) {
    console.error('Unknown scraper:', scraper, 'Available:', Object.keys(scrapers).join(', '));
    process.exit(1);
  }
  const results = await fn();
  console.log(JSON.stringify((results as unknown[]).slice(0, 5), null, 2));
  console.log('Total:', results.length);
}

main().catch(console.error);
