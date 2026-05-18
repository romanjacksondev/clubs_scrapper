/**
 * Central scraper registry.
 *
 * Keys are the exact club names as stored in the database.
 * Values are the default-exported scraper functions.
 *
 * To add a new scraper: create the file and add one line here.
 * No name-normalisation, no filesystem scanning, no path-traversal concerns.
 */
import type { Product } from '../../../types/Product';

// — Premier League —
import scrapeArsenal from './PremierLeague/Arsenal/Arsenal';
import scrapeAstonVilla from './PremierLeague/AstonVilla/AstonVilla';
import scrapeBournemouth from './PremierLeague/Bournemouth/Bournemouth';
import scrapeBrentford from './PremierLeague/Brentford/Brentford';
import scrapeBrighton from './PremierLeague/Brighton/Brighton';
import scrapeBurnley from './PremierLeague/Burnley/Burnley';
import scrapeChelsea from './PremierLeague/Chelsea/Chelsea';
import scrapeCrystalPalace from './PremierLeague/CrystalPalace/CrystalPalace';
import scrapeEverton from './PremierLeague/Everton/Everton';
import scrapeFulham from './PremierLeague/Fulham/Fulham';
import scrapeLiverpool from './PremierLeague/Liverpool/Liverpool';
import scrapeLutonTown from './PremierLeague/LutonTown/LutonTown';
import scrapeManchesterCity from './PremierLeague/ManchesterCity/ManchesterCity';
import scrapeManchesterUnited from './PremierLeague/ManchesterUnited/ManchesterUnited';
import scrapeNewcastleUnited from './PremierLeague/NewcastleUnited/NewcastleUnited';
import scrapeNottinghamForest from './PremierLeague/NottinghamForest/NottinghamForest';
import scrapeSheffieldUnited from './PremierLeague/SheffieldUnited/SheffieldUnited';
import scrapeTottenham from './PremierLeague/TottenhamHotspur/TottenhamHotspur';
import scrapeWestHamUnited from './PremierLeague/WestHamUnited/WestHamUnited';
import scrapeWolves from './PremierLeague/Wolves/Wolves';

// — Bundesliga —
import scrape1FCHeidenheim from './Bundesliga/1FCHeidenheim/1FCHeidenheim';
import scrapeBayerLeverkusen from './Bundesliga/BayerLeverkusen/BayerLeverkusen';
import scrapeBayernMunich from './Bundesliga/BayernMunich/BayernMunich';
import scrapeBorussiaDortmund from './Bundesliga/BorussiaDortmund/BorussiaDortmund';
import scrapeBorussiaMoenchengladbach from './Bundesliga/BorussiaMönchengladbach/BorussiaMönchengladbach';
import scrapeDarmstadt98 from './Bundesliga/Darmstadt98/Darmstadt98';
import scrapeEintrachtFrankfurt from './Bundesliga/EintrachtFrankfurt/EintrachtFrankfurt';
import scrapeFCAugsburg from './Bundesliga/FCAugsburg/FCAugsburg';
import scrapeMainz05 from './Bundesliga/Mainz05/Mainz05';
import scrapeRBLeipzig from './Bundesliga/RBLeipzig/RBLeipzig';
import scrapeSCFreiburg from './Bundesliga/SCFreiburg/SCFreiburg';
import scrapeTSGHoffenheim from './Bundesliga/TSGHoffenheim/TSGHoffenheim';
import scrapeUnionBerlin from './Bundesliga/UnionBerlin/UnionBerlin';
import scrapeVfBStuttgart from './Bundesliga/VfBStuttgart/VfBStuttgart';
import scrapeVfLWolfsburg from './Bundesliga/VfLWolfsburg/VfLWolfsburg';
import scrapeWerderBremen from './Bundesliga/WerderBremen/WerderBremen';

// — Brasileirão —
import scrapeCorinthians from './Brasileirão/Corinthians/Corinthians';
import scrapeFlamengo from './Brasileirão/Flamengo/Flamengo';
import scrapePalmeiras from './Brasileirão/Palmeiras/Palmeiras';

// — Primera División —
import scrapeBocaJuniors from './PrimeraDivisión/BocaJuniors/BocaJuniors';
import scrapeEstudiantes from './PrimeraDivisión/Estudiantes/Estudiantes';
import scrapeHuracán from './PrimeraDivisión/Huracán/Huracán';
import scrapeIndependiente from './PrimeraDivisión/Independiente/Independiente';
import scrapeRacingClub from './PrimeraDivisión/RacingClub/RacingClub';
import scrapeRiverPlate from './PrimeraDivisión/RiverPlate/RiverPlate';
import scrapeRosarioCentral from './PrimeraDivisión/RosarioCentral/RosarioCentral';
import scrapeSanLorenzo from './PrimeraDivisión/SanLorenzo/SanLorenzo';
import scrapeVélezSarsfield from './PrimeraDivisión/VélezSarsfield/VélezSarsfield';

// — La Liga —
import scrapeAtleticoMadrid from './LaLiga/AtléticoMadrid/AtléticoMadrid';
import scrapeBarcelona from './LaLiga/Barcelona/Barcelona';
import scrapeRealMadrid from './LaLiga/RealMadrid/RealMadrid';
import scrapeSevilla from './LaLiga/Sevilla/Sevilla';
import scrapeValencia from './LaLiga/Valencia/Valencia';

// — Serie A —
import scrapeACMilan from './SerieA/ACMilan/ACMilan';
import scrapeASRoma from './SerieA/ASRoma/ASRoma';
import scrapeAtalanta from './SerieA/Atalanta/Atalanta';
import scrapeBologna from './SerieA/Bologna/Bologna';
import scrapeCagliari from './SerieA/Cagliari/Cagliari';
import scrapeEmpoli from './SerieA/Empoli/Empoli';
import scrapeFiorentina from './SerieA/Fiorentina/Fiorentina';
import scrapeFrosinone from './SerieA/Frosinone/Frosinone';
import scrapeGenoa from './SerieA/Genoa/Genoa';
import scrapeHellasVerona from './SerieA/HellasVerona/HellasVerona';
import scrapeInterMilan from './SerieA/InterMilan/InterMilan';
import scrapeJuventus from './SerieA/Juventus/Juventus';
import scrapeLazio from './SerieA/Lazio/Lazio';
import scrapeLecce from './SerieA/Lecce/Lecce';
import scrapeMonza from './SerieA/Monza/Monza';
import scrapeNapoli from './SerieA/Napoli/Napoli';
import scrapeTorino from './SerieA/Torino/Torino';
import scrapeUdinese from './SerieA/Udinese/Udinese';

// — MLS —
import scrapeInterMiami from './MLS/InterMiami/InterMiami';
import scrapeLAGalaxy from './MLS/LAGalaxy/LAGalaxy';
import scrapeNewYorkCityFC from './MLS/NewYorkCityFC/NewYorkCityFC';

// — Ligue 1 —
import scrapeMarseille from './Ligue1/Marseille/Marseille';
import scrapeMonaco from './Ligue1/Monaco/Monaco';
import scrapeOlympiqueLyonnais from './Ligue1/OlympiqueLyonnais/OlympiqueLyonnais';
import scrapePSG from './Ligue1/PSG/PSG';

// — Liga MX —
import scrapeChivas from './LigaMX/ChivasGuadalajara/ChivasGuadalajara';
import scrapeClubAmerica from './LigaMX/ClubAmerica/ClubAmerica';
import scrapeCruzAzul from './LigaMX/CruzAzul/CruzAzul';

// — Primeira Liga —
import scrapeBenfica from './PrimeiraLiga/Benfica/Benfica';
import scrapePorto from './PrimeiraLiga/Porto/Porto';
import scrapeSpotingCP from './PrimeiraLiga/SportingCP/SportingCP';

// — Eredivisie —
import scrapeAjax from './Eredivisie/Ajax/Ajax';
import scrapeAZ from './Eredivisie/AZ/AZ';
import scrapeFCTwente from './Eredivisie/FCTwente/FCTwente';
import scrapeFCUtrecht from './Eredivisie/FCUtrecht/FCUtrecht';
import scrapeFeyenoord from './Eredivisie/Feyenoord/Feyenoord';
import scrapeNEC from './Eredivisie/NEC/NEC';
import scrapePSVEindhoven from './Eredivisie/PSVEindhoven/PSVEindhoven';
import scrapeSCHeerenveen from './Eredivisie/SCHeerenveen/SCHeerenveen';

export type ScraperFn = () => Promise<Product[]>;

export const SCRAPERS: Readonly<Record<string, ScraperFn>> = {
  // Premier League
  Arsenal: scrapeArsenal,
  'Aston Villa': scrapeAstonVilla,
  Bournemouth: scrapeBournemouth,
  Brentford: scrapeBrentford,
  Brighton: scrapeBrighton,
  Burnley: scrapeBurnley,
  Chelsea: scrapeChelsea,
  'Crystal Palace': scrapeCrystalPalace,
  Everton: scrapeEverton,
  Fulham: scrapeFulham,
  Liverpool: scrapeLiverpool,
  'Luton Town': scrapeLutonTown,
  'Manchester City': scrapeManchesterCity,
  'Manchester United': scrapeManchesterUnited,
  'Newcastle United': scrapeNewcastleUnited,
  'Nottingham Forest': scrapeNottinghamForest,
  'Sheffield United': scrapeSheffieldUnited,
  'Tottenham Hotspur': scrapeTottenham,
  'West Ham United': scrapeWestHamUnited,
  Wolves: scrapeWolves,

  // Bundesliga
  'Bayer Leverkusen': scrapeBayerLeverkusen,
  'Bayern Munich': scrapeBayernMunich,
  'Borussia Dortmund': scrapeBorussiaDortmund,
  'Borussia Mönchengladbach': scrapeBorussiaMoenchengladbach,
  'Darmstadt 98': scrapeDarmstadt98,
  'Eintracht Frankfurt': scrapeEintrachtFrankfurt,
  'FC Augsburg': scrapeFCAugsburg,
  '1. FC Heidenheim': scrape1FCHeidenheim,
  'Mainz 05': scrapeMainz05,
  'RB Leipzig': scrapeRBLeipzig,
  'SC Freiburg': scrapeSCFreiburg,
  'TSG Hoffenheim': scrapeTSGHoffenheim,
  'Union Berlin': scrapeUnionBerlin,
  'VfB Stuttgart': scrapeVfBStuttgart,
  'VfL Wolfsburg': scrapeVfLWolfsburg,
  'Werder Bremen': scrapeWerderBremen,

  // Brasileirão
  Corinthians: scrapeCorinthians,
  Flamengo: scrapeFlamengo,
  Palmeiras: scrapePalmeiras,

  // Primera División
  'Boca Juniors': scrapeBocaJuniors,
  'River Plate': scrapeRiverPlate,
  'San Lorenzo': scrapeSanLorenzo,
  Independiente: scrapeIndependiente,
  Estudiantes: scrapeEstudiantes,
  'Vélez Sarsfield': scrapeVélezSarsfield,
  'Rosario Central': scrapeRosarioCentral,
  'Racing Club': scrapeRacingClub,
  Huracán: scrapeHuracán,

  // La Liga
  'Atlético Madrid': scrapeAtleticoMadrid,
  Barcelona: scrapeBarcelona,
  'Real Madrid': scrapeRealMadrid,
  Sevilla: scrapeSevilla,
  Valencia: scrapeValencia,

  // Serie A
  'AC Milan': scrapeACMilan,
  'AS Roma': scrapeASRoma,
  Atalanta: scrapeAtalanta,
  Bologna: scrapeBologna,
  Cagliari: scrapeCagliari,
  Empoli: scrapeEmpoli,
  Fiorentina: scrapeFiorentina,
  Frosinone: scrapeFrosinone,
  Genoa: scrapeGenoa,
  'Hellas Verona': scrapeHellasVerona,
  'Inter Milan': scrapeInterMilan,
  Juventus: scrapeJuventus,
  Lazio: scrapeLazio,
  Lecce: scrapeLecce,
  Monza: scrapeMonza,
  Napoli: scrapeNapoli,
  Torino: scrapeTorino,
  Udinese: scrapeUdinese,

  // MLS
  'Inter Miami': scrapeInterMiami,
  'LA Galaxy': scrapeLAGalaxy,
  'New York City FC': scrapeNewYorkCityFC,

  // Ligue 1
  Marseille: scrapeMarseille,
  Monaco: scrapeMonaco,
  'Olympique Lyonnais': scrapeOlympiqueLyonnais,
  'Paris Saint-Germain': scrapePSG,

  // Liga MX
  'Chivas Guadalajara': scrapeChivas,
  'Club América': scrapeClubAmerica,
  'Cruz Azul': scrapeCruzAzul,

  // Primeira Liga
  Benfica: scrapeBenfica,
  Porto: scrapePorto,
  'Sporting CP': scrapeSpotingCP,

  // Eredivisie
  Ajax: scrapeAjax,
  AZ: scrapeAZ,
  'FC Twente': scrapeFCTwente,
  'FC Utrecht': scrapeFCUtrecht,
  Feyenoord: scrapeFeyenoord,
  NEC: scrapeNEC,
  'PSV Eindhoven': scrapePSVEindhoven,
  'SC Heerenveen': scrapeSCHeerenveen,
};
