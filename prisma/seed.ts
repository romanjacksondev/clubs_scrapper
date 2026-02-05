import 'dotenv/config'
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Major football leagues
  const leagues = [
    { name: 'Premier League' },
    { name: 'La Liga' },
    { name: 'Bundesliga' },
    { name: 'Serie A' },
    { name: 'Ligue 1' },
    { name: 'Eredivisie' },
    { name: 'Primeira Liga' },
    { name: 'MLS' },
    { name: 'Brasileirão' },
    { name: 'Liga MX' }
  ];

  // Insert leagues
  const leagueRecords = await Promise.all(
    leagues.map(league => prisma.league.create({ data: league }))
  );

  // Example clubs for each league
  const clubs = [
    // Premier League
    { name: 'Arsenal', officialSiteUrl: 'https://www.arsenal.com', officialStoreUrl: 'https://arsenaldirect.arsenal.com', leagueId: leagueRecords[0].id },
    { name: 'Aston Villa', officialSiteUrl: 'https://www.avfc.co.uk', officialStoreUrl: 'https://shop.avfc.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Bournemouth', officialSiteUrl: 'https://www.afcb.co.uk', officialStoreUrl: 'https://shop.afcb.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Brentford', officialSiteUrl: 'https://www.brentfordfc.com', officialStoreUrl: 'https://shop.brentfordfc.com', leagueId: leagueRecords[0].id },
    { name: 'Brighton & Hove Albion', officialSiteUrl: 'https://www.brightonandhovealbion.com', officialStoreUrl: 'https://shop.brightonandhovealbion.com', leagueId: leagueRecords[0].id },
    { name: 'Burnley', officialSiteUrl: 'https://www.burnleyfootballclub.com', officialStoreUrl: 'https://shop.burnleyfootballclub.com', leagueId: leagueRecords[0].id },
    { name: 'Chelsea', officialSiteUrl: 'https://www.chelseafc.com', officialStoreUrl: 'https://shop.chelseafc.com', leagueId: leagueRecords[0].id },
    { name: 'Crystal Palace', officialSiteUrl: 'https://www.cpfc.co.uk', officialStoreUrl: 'https://shop.cpfc.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Everton', officialSiteUrl: 'https://www.evertonfc.com', officialStoreUrl: 'https://evertondirect.evertonfc.com', leagueId: leagueRecords[0].id },
    { name: 'Fulham', officialSiteUrl: 'https://www.fulhamfc.com', officialStoreUrl: 'https://shop.fulhamfc.com', leagueId: leagueRecords[0].id },
    { name: 'Liverpool', officialSiteUrl: 'https://www.liverpoolfc.com', officialStoreUrl: 'https://store.liverpoolfc.com', leagueId: leagueRecords[0].id },
    { name: 'Luton Town', officialSiteUrl: 'https://www.lutontown.co.uk', officialStoreUrl: 'https://shop.lutontown.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Manchester City', officialSiteUrl: 'https://www.mancity.com', officialStoreUrl: 'https://shop.mancity.com', leagueId: leagueRecords[0].id },
    { name: 'Manchester United', officialSiteUrl: 'https://www.manutd.com', officialStoreUrl: 'https://store.manutd.com', leagueId: leagueRecords[0].id },
    { name: 'Newcastle United', officialSiteUrl: 'https://www.nufc.co.uk', officialStoreUrl: 'https://shop.nufc.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Nottingham Forest', officialSiteUrl: 'https://www.nottinghamforest.co.uk', officialStoreUrl: 'https://shop.nottinghamforest.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Sheffield United', officialSiteUrl: 'https://www.sufc.co.uk', officialStoreUrl: 'https://shop.sufc.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Tottenham Hotspur', officialSiteUrl: 'https://www.tottenhamhotspur.com', officialStoreUrl: 'https://shop.tottenhamhotspur.com', leagueId: leagueRecords[0].id },
    { name: 'West Ham United', officialSiteUrl: 'https://www.whufc.com', officialStoreUrl: 'https://shop.whufc.com', leagueId: leagueRecords[0].id },
    { name: 'Wolverhampton Wanderers', officialSiteUrl: 'https://www.wolves.co.uk', officialStoreUrl: 'https://shop.wolves.co.uk', leagueId: leagueRecords[0].id },
    // La Liga
    { name: 'Real Madrid', officialSiteUrl: 'https://www.realmadrid.com', officialStoreUrl: 'https://shop.realmadrid.com', leagueId: leagueRecords[1].id },
    { name: 'Barcelona', officialSiteUrl: 'https://www.fcbarcelona.com', officialStoreUrl: 'https://store.fcbarcelona.com', leagueId: leagueRecords[1].id },
    // Bundesliga
    { name: 'Bayern Munich', officialSiteUrl: 'https://fcbayern.com', officialStoreUrl: 'https://fcbayern.com/shop', leagueId: leagueRecords[2].id },
    { name: 'Borussia Dortmund', officialSiteUrl: 'https://www.bvb.de', officialStoreUrl: 'https://shop.bvb.de', leagueId: leagueRecords[2].id },
    // Serie A
    { name: 'Juventus', officialSiteUrl: 'https://www.juventus.com', officialStoreUrl: 'https://store.juventus.com', leagueId: leagueRecords[3].id },
    { name: 'AC Milan', officialSiteUrl: 'https://www.acmilan.com', officialStoreUrl: 'https://store.acmilan.com', leagueId: leagueRecords[3].id },
    // Ligue 1
    { name: 'Paris Saint-Germain', officialSiteUrl: 'https://en.psg.fr', officialStoreUrl: 'https://store.psg.fr', leagueId: leagueRecords[4].id },
    { name: 'Olympique Lyonnais', officialSiteUrl: 'https://www.ol.fr', officialStoreUrl: 'https://boutique.ol.fr', leagueId: leagueRecords[4].id }
  ];

  await prisma.club.createMany({ data: clubs });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
