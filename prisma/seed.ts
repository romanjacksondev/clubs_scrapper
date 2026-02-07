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
    { name: 'Liga MX' },
    { name: 'Primera División' } // Argentina
  ];

  // Insert leagues
  const leagueRecords = await Promise.all(
    leagues.map(league => prisma.league.create({ data: league }))
  );

  // All clubs for each league (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Eredivisie, Primeira Liga, MLS, Brasileirão, Liga MX, Primera División)
  // For brevity, only a few clubs per league are shown here. You should expand this list with all clubs as needed.
  const clubs = [
    // Premier League (England)
    { name: 'Arsenal', officialSiteUrl: 'https://www.arsenal.com', officialStoreUrl: 'https://arsenaldirect.arsenal.com', leagueId: leagueRecords[0].id },
    { name: 'Aston Villa', officialSiteUrl: 'https://www.avfc.co.uk', officialStoreUrl: 'https://shop.avfc.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Bournemouth', officialSiteUrl: 'https://www.afcb.co.uk', officialStoreUrl: 'https://shop.afcb.co.uk', leagueId: leagueRecords[0].id },
    { name: 'Brentford', officialSiteUrl: 'https://www.brentfordfc.com', officialStoreUrl: 'https://shop.brentfordfc.com', leagueId: leagueRecords[0].id },
    { name: 'Brighton', officialSiteUrl: 'https://www.brightonandhovealbion.com', officialStoreUrl: 'https://shop.brightonandhovealbion.com', leagueId: leagueRecords[0].id },
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
    { name: 'Wolves', officialSiteUrl: 'https://www.wolves.co.uk', officialStoreUrl: 'https://shop.wolves.co.uk', leagueId: leagueRecords[0].id },
    // La Liga (Spain)
    { name: 'Real Madrid', officialSiteUrl: 'https://www.realmadrid.com', officialStoreUrl: 'https://shop.realmadrid.com', leagueId: leagueRecords[1].id },
    { name: 'Barcelona', officialSiteUrl: 'https://www.fcbarcelona.com', officialStoreUrl: 'https://store.fcbarcelona.com', leagueId: leagueRecords[1].id },
    { name: 'Atlético Madrid', officialSiteUrl: 'https://www.atleticodemadrid.com', officialStoreUrl: 'https://shop.atleticodemadrid.com', leagueId: leagueRecords[1].id },
    { name: 'Sevilla', officialSiteUrl: 'https://www.sevillafc.es', officialStoreUrl: 'https://shop.sevillafc.es', leagueId: leagueRecords[1].id },
    { name: 'Valencia', officialSiteUrl: 'https://www.valenciacf.com', officialStoreUrl: 'https://shop.valenciacf.com', leagueId: leagueRecords[1].id },
    // Bundesliga (Germany)
    { name: 'Bayern Munich', officialSiteUrl: 'https://fcbayern.com', officialStoreUrl: 'https://fcbayern.com/shop', leagueId: leagueRecords[2].id },
    { name: 'Borussia Dortmund', officialSiteUrl: 'https://www.bvb.de', officialStoreUrl: 'https://shop.bvb.de', leagueId: leagueRecords[2].id },
    { name: 'RB Leipzig', officialSiteUrl: 'https://www.dierotenbullen.com', officialStoreUrl: 'https://shop.dierotenbullen.com', leagueId: leagueRecords[2].id },
    { name: 'Bayer Leverkusen', officialSiteUrl: 'https://www.bayer04.de', officialStoreUrl: 'https://shop.bayer04.de', leagueId: leagueRecords[2].id },
    { name: 'Union Berlin', officialSiteUrl: 'https://www.fc-union-berlin.de', officialStoreUrl: 'https://www.union-zeughaus.de', leagueId: leagueRecords[2].id },
    { name: 'SC Freiburg', officialSiteUrl: 'https://www.scfreiburg.com', officialStoreUrl: 'https://shop.scfreiburg.com', leagueId: leagueRecords[2].id },
    { name: 'Eintracht Frankfurt', officialSiteUrl: 'https://www.eintracht.de', officialStoreUrl: 'https://shop.eintracht.de', leagueId: leagueRecords[2].id },
    { name: 'VfL Wolfsburg', officialSiteUrl: 'https://www.vfl-wolfsburg.de', officialStoreUrl: 'https://shop.vfl-wolfsburg.de', leagueId: leagueRecords[2].id },
    { name: 'Borussia Mönchengladbach', officialSiteUrl: 'https://www.borussia.de', officialStoreUrl: 'https://shop.borussia.de', leagueId: leagueRecords[2].id },
    { name: 'Werder Bremen', officialSiteUrl: 'https://www.werder.de', officialStoreUrl: 'https://shop.werder.de', leagueId: leagueRecords[2].id },
    { name: 'VfB Stuttgart', officialSiteUrl: 'https://www.vfb.de', officialStoreUrl: 'https://shop.vfb.de', leagueId: leagueRecords[2].id },
    { name: 'FC Augsburg', officialSiteUrl: 'https://www.fcaugsburg.de', officialStoreUrl: 'https://shop.fcaugsburg.de', leagueId: leagueRecords[2].id },
    { name: 'Mainz 05', officialSiteUrl: 'https://www.mainz05.de', officialStoreUrl: 'https://shop.mainz05.de', leagueId: leagueRecords[2].id },
    { name: 'TSG Hoffenheim', officialSiteUrl: 'https://www.tsg-hoffenheim.de', officialStoreUrl: 'https://shop.tsg-hoffenheim.de', leagueId: leagueRecords[2].id },
    { name: '1. FC Heidenheim', officialSiteUrl: 'https://www.fc-heidenheim.de', officialStoreUrl: 'https://shop.fc-heidenheim.de', leagueId: leagueRecords[2].id },
    { name: 'Darmstadt 98', officialSiteUrl: 'https://www.sv98.de', officialStoreUrl: 'https://shop.sv98.de', leagueId: leagueRecords[2].id },
    // Serie A (Italy)
    { name: 'Juventus', officialSiteUrl: 'https://www.juventus.com', officialStoreUrl: 'https://store.juventus.com', leagueId: leagueRecords[3].id },
    { name: 'AC Milan', officialSiteUrl: 'https://www.acmilan.com', officialStoreUrl: 'https://store.acmilan.com', leagueId: leagueRecords[3].id },
    { name: 'Inter Milan', officialSiteUrl: 'https://www.inter.it', officialStoreUrl: 'https://store.inter.it', leagueId: leagueRecords[3].id },
    { name: 'AS Roma', officialSiteUrl: 'https://www.asroma.com', officialStoreUrl: 'https://store.asroma.com', leagueId: leagueRecords[3].id },
    { name: 'Napoli', officialSiteUrl: 'https://www.sscnapoli.it', officialStoreUrl: 'https://store.sscnapoli.it', leagueId: leagueRecords[3].id },
    { name: 'Lazio', officialSiteUrl: 'https://www.sslazio.it', officialStoreUrl: 'https://sslazio.style', leagueId: leagueRecords[3].id },
    { name: 'Atalanta', officialSiteUrl: 'https://www.atalanta.it', officialStoreUrl: 'https://atalanta.officialstore.it', leagueId: leagueRecords[3].id },
    { name: 'Fiorentina', officialSiteUrl: 'https://www.acffiorentina.com', officialStoreUrl: 'https://shop.acffiorentina.com', leagueId: leagueRecords[3].id },
    { name: 'Torino', officialSiteUrl: 'https://www.torinofc.it', officialStoreUrl: 'https://store.torinofc.it', leagueId: leagueRecords[3].id },
    { name: 'Udinese', officialSiteUrl: 'https://www.udinese.it', officialStoreUrl: 'https://store.udinese.it', leagueId: leagueRecords[3].id },
    { name: 'Bologna', officialSiteUrl: 'https://www.bolognafc.it', officialStoreUrl: 'https://bolognafcstore.com', leagueId: leagueRecords[3].id },
    { name: 'Monza', officialSiteUrl: 'https://www.acmonza.com', officialStoreUrl: 'https://shop.acmonza.com', leagueId: leagueRecords[3].id },
    { name: 'Genoa', officialSiteUrl: 'https://genoacfc.it', officialStoreUrl: 'https://genoacfc.it/shop', leagueId: leagueRecords[3].id },
    { name: 'Cagliari', officialSiteUrl: 'https://www.cagliaricalcio.com', officialStoreUrl: 'https://shop.cagliaricalcio.com', leagueId: leagueRecords[3].id },
    { name: 'Empoli', officialSiteUrl: 'https://empolifc.com', officialStoreUrl: 'https://empolifc.com/shop', leagueId: leagueRecords[3].id },
    { name: 'Frosinone', officialSiteUrl: 'https://www.frosinonecalcio.com', officialStoreUrl: 'https://shop.frosinonecalcio.com', leagueId: leagueRecords[3].id },
    { name: 'Hellas Verona', officialSiteUrl: 'https://www.hellasverona.it', officialStoreUrl: 'https://store.hellasverona.it', leagueId: leagueRecords[3].id },
    { name: 'Lecce', officialSiteUrl: 'https://www.uslecce.it', officialStoreUrl: 'https://shop.uslecce.it', leagueId: leagueRecords[3].id },
    // Ligue 1 (France)
    { name: 'Paris Saint-Germain', officialSiteUrl: 'https://en.psg.fr', officialStoreUrl: 'https://store.psg.fr', leagueId: leagueRecords[4].id },
    { name: 'Olympique Lyonnais', officialSiteUrl: 'https://www.ol.fr', officialStoreUrl: 'https://boutique.ol.fr', leagueId: leagueRecords[4].id },
    { name: 'Marseille', officialSiteUrl: 'https://www.om.fr', officialStoreUrl: 'https://boutique.om.fr', leagueId: leagueRecords[4].id },
    { name: 'Monaco', officialSiteUrl: 'https://www.asmonaco.com', officialStoreUrl: 'https://boutique.asmonaco.com', leagueId: leagueRecords[4].id },
    // Eredivisie (Netherlands)
    { name: 'Ajax', officialSiteUrl: 'https://www.ajax.nl', officialStoreUrl: 'https://shop.ajax.nl', leagueId: leagueRecords[5].id },
    { name: 'PSV Eindhoven', officialSiteUrl: 'https://www.psv.nl', officialStoreUrl: 'https://shop.psv.nl', leagueId: leagueRecords[5].id },
    { name: 'Feyenoord', officialSiteUrl: 'https://www.feyenoord.nl', officialStoreUrl: 'https://shop.feyenoord.nl', leagueId: leagueRecords[5].id },
    // Primeira Liga (Portugal)
    { name: 'Benfica', officialSiteUrl: 'https://www.slbenfica.pt', officialStoreUrl: 'https://loja.slbenfica.pt', leagueId: leagueRecords[6].id },
    { name: 'Porto', officialSiteUrl: 'https://www.fcporto.pt', officialStoreUrl: 'https://loja.fcporto.pt', leagueId: leagueRecords[6].id },
    { name: 'Sporting CP', officialSiteUrl: 'https://www.sporting.pt', officialStoreUrl: 'https://loja.sporting.pt', leagueId: leagueRecords[6].id },
    // MLS (USA)
    { name: 'LA Galaxy', officialSiteUrl: 'https://www.lagalaxy.com', officialStoreUrl: 'https://www.lagalaxy.com/shop', leagueId: leagueRecords[7].id },
    { name: 'Inter Miami', officialSiteUrl: 'https://www.intermiamicf.com', officialStoreUrl: 'https://www.mlsstore.com/inter-miami-cf/t-47222016+z-92943-3240969642', leagueId: leagueRecords[7].id },
    { name: 'New York City FC', officialSiteUrl: 'https://www.nycfc.com', officialStoreUrl: 'https://www.mlsstore.com/new-york-city-fc/t-36863598+z-91936-3240969642', leagueId: leagueRecords[7].id },
    // Brasileirão (Brazil)
    { name: 'Flamengo', officialSiteUrl: 'https://www.flamengo.com.br', officialStoreUrl: 'https://loja.flamengo.com.br', leagueId: leagueRecords[8].id },
    { name: 'Palmeiras', officialSiteUrl: 'https://www.palmeiras.com.br', officialStoreUrl: 'https://loja.palmeiras.com.br', leagueId: leagueRecords[8].id },
    { name: 'Corinthians', officialSiteUrl: 'https://www.corinthians.com.br', officialStoreUrl: 'https://www.shoptimao.com.br', leagueId: leagueRecords[8].id },
    // Liga MX (Mexico)
    { name: 'Club América', officialSiteUrl: 'https://www.clubamerica.com.mx', officialStoreUrl: 'https://www.tiendaclubamerica.com.mx', leagueId: leagueRecords[9].id },
    { name: 'Chivas Guadalajara', officialSiteUrl: 'https://www.chivasdecorazon.com.mx', officialStoreUrl: 'https://www.tiendachivas.com.mx', leagueId: leagueRecords[9].id },
    { name: 'Cruz Azul', officialSiteUrl: 'https://www.cruzazulfc.com.mx', officialStoreUrl: 'https://www.tiendacruzazul.mx', leagueId: leagueRecords[9].id },
    // Primera División (Argentina)
    { name: 'Boca Juniors', officialSiteUrl: 'https://www.bocajuniors.com.ar', officialStoreUrl: 'https://bocashop.com.ar', leagueId: leagueRecords[10].id },
    { name: 'River Plate', officialSiteUrl: 'https://www.cariverplate.com.ar', officialStoreUrl: 'https://tienda.cariverplate.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Independiente', officialSiteUrl: 'https://www.clubaindependiente.com.ar', officialStoreUrl: 'https://tienda.clubaindependiente.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Racing Club', officialSiteUrl: 'https://www.racingclub.com.ar', officialStoreUrl: 'https://tiendaracing.com.ar', leagueId: leagueRecords[10].id },
    { name: 'San Lorenzo', officialSiteUrl: 'https://sanlorenzo.com.ar', officialStoreUrl: 'https://tienda.sanlorenzo.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Vélez Sarsfield', officialSiteUrl: 'https://velez.com.ar', officialStoreUrl: 'https://tiendavelez.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Huracán', officialSiteUrl: 'https://cahuracan.com', officialStoreUrl: 'https://tiendahuracan.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Estudiantes', officialSiteUrl: 'https://estudiantesdelaplata.com', officialStoreUrl: 'https://tiendaestudiantes.com.ar', leagueId: leagueRecords[10].id },
    { name: 'Rosario Central', officialSiteUrl: 'https://rosariocentral.com', officialStoreUrl: 'https://tiendarosariocentral.com.ar', leagueId: leagueRecords[10].id },
  ];

  await prisma.club.createMany({ data: clubs });
}

// main()
//   .catch(e => { console.error(e); process.exit(1); })
//   .finally(() => prisma.$disconnect());

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });