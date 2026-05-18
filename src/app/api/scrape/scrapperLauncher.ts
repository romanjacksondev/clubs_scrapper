// scrapperLauncher.ts
import { SCRAPERS } from '../scrappers/registry';

export function launchScrapper(clubName: string) {
  const scrapper = SCRAPERS[clubName];
  if (!scrapper) {
    throw new Error(`No scrapper registered for: ${clubName}`);
  }
  return scrapper;
}
