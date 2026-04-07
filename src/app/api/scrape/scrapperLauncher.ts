// scrapperLauncher.ts

export async function launchScrapper(trimmedLeague: string, trimmedClub: string) {
  const scrapperPath = `../scrappers/${trimmedLeague}/${trimmedClub}/${trimmedClub}.ts`;
  const scrapperModule = await import(`${scrapperPath}`);
  return scrapperModule.default;
}
