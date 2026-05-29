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
import scrapeLeedsUnited from './PremierLeague/LeedsUnited/LeedsUnited';
import scrapeLiverpool from './PremierLeague/Liverpool/Liverpool';
import scrapeLutonTown from './PremierLeague/LutonTown/LutonTown';
import scrapeManchesterCity from './PremierLeague/ManchesterCity/ManchesterCity';
import scrapeManchesterUnited from './PremierLeague/ManchesterUnited/ManchesterUnited';
import scrapeNewcastleUnited from './PremierLeague/NewcastleUnited/NewcastleUnited';
import scrapeNottinghamForest from './PremierLeague/NottinghamForest/NottinghamForest';
import scrapeSheffieldUnited from './PremierLeague/SheffieldUnited/SheffieldUnited';
import scrapeSunderlandAFC from './PremierLeague/SunderlandAFC/SunderlandAFC';
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
import scrapeAthleticoPR from './Brasileirão/AthleticoPR/AthleticoPR';
import scrapeAtleticoMineiro from './Brasileirão/AtléticoMineiro/AtléticoMineiro';
import scrapeBahia from './Brasileirão/Bahia/Bahia';
import scrapeBotafogo from './Brasileirão/Botafogo/Botafogo';
import scrapeBragantino from './Brasileirão/Bragantino/Bragantino';
import scrapeCorinthians from './Brasileirão/Corinthians/Corinthians';
import scrapeCruzeiro from './Brasileirão/Cruzeiro/Cruzeiro';
import scrapeFlamengo from './Brasileirão/Flamengo/Flamengo';
import scrapeFluminense from './Brasileirão/Fluminense/Fluminense';
import scrapeFortaleza from './Brasileirão/Fortaleza/Fortaleza';
import scrapeGremio from './Brasileirão/Grêmio/Grêmio';
import scrapeInternacional from './Brasileirão/Internacional/Internacional';
import scrapeJuventude from './Brasileirão/Juventude/Juventude';
import scrapeMirassol from './Brasileirão/Mirassol/Mirassol';
import scrapeNovorizontino from './Brasileirão/Novorizontino/Novorizontino';
import scrapePalmeiras from './Brasileirão/Palmeiras/Palmeiras';
import scrapeSantos from './Brasileirão/Santos/Santos';
import scrapeSportRecife from './Brasileirão/SportRecife/SportRecife';
import scrapeSaoPaulo from './Brasileirão/SãoPaulo/SãoPaulo';
import scrapeVasco from './Brasileirão/VascoDaGama/VascoDaGama';
import scrapeVitoria from './Brasileirão/Vitória/Vitória';

// — Primera División —
import scrapeArsenalDeSarandí from './PrimeraDivisión/ArsenalDeSarandí/ArsenalDeSarandí';
import scrapeAtléticoTucumán from './PrimeraDivisión/AtléticoTucumán/AtléticoTucumán';
import scrapeBanfield from './PrimeraDivisión/Banfield/Banfield';
import scrapeBarracasCentral from './PrimeraDivisión/BarracasCentral/BarracasCentral';
import scrapeBelgrano from './PrimeraDivisión/Belgrano/Belgrano';
import scrapeBocaJuniors from './PrimeraDivisión/BocaJuniors/BocaJuniors';
import scrapeCentralCórdoba from './PrimeraDivisión/CentralCórdoba/CentralCórdoba';
import scrapeDefensaYJusticia from './PrimeraDivisión/DefensaYJusticia/DefensaYJusticia';
import scrapeEstudiantes from './PrimeraDivisión/Estudiantes/Estudiantes';
import scrapeGimnasiaYEsgrimaLP from './PrimeraDivisión/GimnasiaYEsgrimaLP/GimnasiaYEsgrimaLP';
import scrapeGodoyCruz from './PrimeraDivisión/GodoyCruz/GodoyCruz';
import scrapeHuracán from './PrimeraDivisión/Huracán/Huracán';
import scrapeIndependiente from './PrimeraDivisión/Independiente/Independiente';
import scrapeInstituto from './PrimeraDivisión/Instituto/Instituto';
import scrapeLanús from './PrimeraDivisión/Lanús/Lanús';
import scrapeNewellsOldBoys from './PrimeraDivisión/NewellsOldBoys/NewellsOldBoys';
import scrapePatronato from './PrimeraDivisión/Patronato/Patronato';
import scrapePlatense from './PrimeraDivisión/Platense/Platense';
import scrapeRacingClub from './PrimeraDivisión/RacingClub/RacingClub';
import scrapeRiverPlate from './PrimeraDivisión/RiverPlate/RiverPlate';
import scrapeRosarioCentral from './PrimeraDivisión/RosarioCentral/RosarioCentral';
import scrapeSanLorenzo from './PrimeraDivisión/SanLorenzo/SanLorenzo';
import scrapeSanMartínTucumán from './PrimeraDivisión/SanMartínTucumán/SanMartínTucumán';
import scrapeSarmiento from './PrimeraDivisión/Sarmiento/Sarmiento';
import scrapeTalleres from './PrimeraDivisión/Talleres/Talleres';
import scrapeTigre from './PrimeraDivisión/Tigre/Tigre';
import scrapeUnión from './PrimeraDivisión/Unión/Unión';
import scrapeVélezSarsfield from './PrimeraDivisión/VélezSarsfield/VélezSarsfield';

// — La Liga —
import scrapeAlaves from './LaLiga/Alavés/Alavés';
import scrapeAthleticBilbao from './LaLiga/AthleticBilbao/AthleticBilbao';
import scrapeAtleticoMadrid from './LaLiga/AtléticoMadrid/AtléticoMadrid';
import scrapeBarcelona from './LaLiga/Barcelona/Barcelona';
import scrapeCeltaVigo from './LaLiga/CeltaVigo/CeltaVigo';
import scrapeElche from './LaLiga/Elche/Elche';
import scrapeEspanyol from './LaLiga/Espanyol/Espanyol';
import scrapeGetafe from './LaLiga/Getafe/Getafe';
import scrapeGirona from './LaLiga/Girona/Girona';
import scrapeLevante from './LaLiga/Levante/Levante';
import scrapeMallorca from './LaLiga/Mallorca/Mallorca';
import scrapeOsasuna from './LaLiga/Osasuna/Osasuna';
import scrapeRayoVallecano from './LaLiga/RayoVallecano/RayoVallecano';
import scrapeRealBetis from './LaLiga/RealBetis/RealBetis';
import scrapeRealMadrid from './LaLiga/RealMadrid/RealMadrid';
import scrapeRealOviedo from './LaLiga/RealOviedo/RealOviedo';
import scrapeRealSociedad from './LaLiga/RealSociedad/RealSociedad';
import scrapeSevilla from './LaLiga/Sevilla/Sevilla';
import scrapeValencia from './LaLiga/Valencia/Valencia';
import scrapeVillarreal from './LaLiga/Villarreal/Villarreal';

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
import scrapeAtlantaUnited from './MLS/AtlantaUnited/AtlantaUnited';
import scrapeAustinFC from './MLS/AustinFC/AustinFC';
import scrapeCFMontreal from './MLS/CFMontreal/CFMontreal';
import scrapeCharlotteFC from './MLS/CharlotteFC/CharlotteFC';
import scrapeChicagoFire from './MLS/ChicagoFire/ChicagoFire';
import scrapeColoradoRapids from './MLS/ColoradoRapids/ColoradoRapids';
import scrapeColumbusCrew from './MLS/ColumbusСrew/ColumbusСrew';
import scrapeDCUnited from './MLS/DCUnited/DCUnited';
import scrapeFCCincinnati from './MLS/FCCincinnati/FCCincinnati';
import scrapeFCDallas from './MLS/FCDallas/FCDallas';
import scrapeHoustonDynamo from './MLS/HoustonDynamo/HoustonDynamo';
import scrapeInterMiami from './MLS/InterMiami/InterMiami';
import scrapeLAGalaxy from './MLS/LAGalaxy/LAGalaxy';
import scrapeLosAngelesFC from './MLS/LosAngelesFC/LosAngelesFC';
import scrapeMinnesotaUnited from './MLS/MinnesotaUnited/MinnesotaUnited';
import scrapeNashvilleSC from './MLS/NashvilleSC/NashvilleSC';
import scrapeNewEnglandRevolution from './MLS/NewEnglandRevolution/NewEnglandRevolution';
import scrapeNewYorkCityFC from './MLS/NewYorkCityFC/NewYorkCityFC';
import scrapeNewYorkRedBulls from './MLS/NewYorkRedBulls/NewYorkRedBulls';
import scrapeOrlandoCitySC from './MLS/OrlandoCitySC/OrlandoCitySC';
import scrapePhiladelphiaUnion from './MLS/PhiladelphiaUnion/PhiladelphiaUnion';
import scrapePortlandTimbers from './MLS/PortlandTimbers/PortlandTimbers';
import scrapeRealSaltLake from './MLS/RealSaltLake/RealSaltLake';
import scrapeSanDiegoFC from './MLS/SanDiegoFC/SanDiegoFC';
import scrapeSanJoseEarthquakes from './MLS/SanJoseEarthquakes/SanJoseEarthquakes';
import scrapeSeattleSounders from './MLS/SeattleSounders/SeattleSounders';
import scrapeSportingKansasCity from './MLS/SportingKansasCity/SportingKansasCity';
import scrapeStLouisCitySC from './MLS/StLouisCitySC/StLouisCitySC';
import scrapeTorontoFC from './MLS/TorontoFC/TorontoFC';
import scrapeVancouverWhitecaps from './MLS/VancouverWhitecaps/VancouverWhitecaps';

// — Ligue 1 —
import scrapeMarseille from './Ligue1/Marseille/Marseille';
import scrapeMonaco from './Ligue1/Monaco/Monaco';
import scrapeOlympiqueLyonnais from './Ligue1/OlympiqueLyonnais/OlympiqueLyonnais';
import scrapePSG from './Ligue1/PSG/PSG';

// — Liga MX —
import scrapeAtlasFC from './LigaMX/AtlasFC/AtlasFC';
import scrapeAtleticoSanLuis from './LigaMX/AtleticoSanLuis/AtleticoSanLuis';
import scrapeCFMonterrey from './LigaMX/CFMonterrey/CFMonterrey';
import scrapeCFPachuca from './LigaMX/CFPachuca/CFPachuca';
import scrapeChivas from './LigaMX/ChivasGuadalajara/ChivasGuadalajara';
import scrapeClubAmerica from './LigaMX/ClubAmerica/ClubAmerica';
import scrapeClubPuebla from './LigaMX/ClubPuebla/ClubPuebla';
import scrapeClubTijuana from './LigaMX/ClubTijuana/ClubTijuana';
import scrapeCruzAzul from './LigaMX/CruzAzul/CruzAzul';
import scrapeDeportivoToluca from './LigaMX/DeportivoToluca/DeportivoToluca';
import scrapeFCJuarez from './LigaMX/FCJuarez/FCJuarez';
import scrapeLeonFC from './LigaMX/LeonFC/LeonFC';
import scrapeMazatlanFC from './LigaMX/MazatlanFC/MazatlanFC';
import scrapeNecaxa from './LigaMX/Necaxa/Necaxa';
import scrapePumasUNAM from './LigaMX/PumasUNAM/PumasUNAM';
import scrapeQueretaroFC from './LigaMX/QueretaroFC/QueretaroFC';
import scrapeSantosLaguna from './LigaMX/SantosLaguna/SantosLaguna';
import scrapeTigresUNAM from './LigaMX/TigresUNAM/TigresUNAM';

// — Primeira Liga —
import scrapeArouca from './PrimeiraLiga/Arouca/Arouca';
import scrapeAVS from './PrimeiraLiga/AVS/AVS';
import scrapeBenfica from './PrimeiraLiga/Benfica/Benfica';
import scrapeBoavista from './PrimeiraLiga/Boavista/Boavista';
import scrapeBraga from './PrimeiraLiga/Braga/Braga';
import scrapeCasaPia from './PrimeiraLiga/CasaPia/CasaPia';
import scrapeEstorilPraia from './PrimeiraLiga/EstorilPraia/EstorilPraia';
import scrapeEstrelaAmadora from './PrimeiraLiga/EstrelaAmadora/EstrelaAmadora';
import scrapeFamalicão from './PrimeiraLiga/Famalicão/Famalicão';
import scrapeFarense from './PrimeiraLiga/Farense/Farense';
import scrapeGilVicente from './PrimeiraLiga/GilVicente/GilVicente';
import scrapeMoreirense from './PrimeiraLiga/Moreirense/Moreirense';
import scrapeNacional from './PrimeiraLiga/Nacional/Nacional';
import scrapePorto from './PrimeiraLiga/Porto/Porto';
import scrapeRioAve from './PrimeiraLiga/RioAve/RioAve';
import scrapeSantaClara from './PrimeiraLiga/SantaClara/SantaClara';
import scrapeSpotingCP from './PrimeiraLiga/SportingCP/SportingCP';
import scrapeVitóriaSC from './PrimeiraLiga/VitóriaSC/VitóriaSC';

// — EFL Championship —
import scrapeBirminghamCity from './EFL/BirminghamCity/BirminghamCity';
import scrapeBlackburnRovers from './EFL/BlackburnRovers/BlackburnRovers';
import scrapeBristolCity from './EFL/BristolCity/BristolCity';
import scrapeCardiffCity from './EFL/CardiffCity/CardiffCity';
import scrapeCharltonAthletic from './EFL/CharltonAthletic/CharltonAthletic';
import scrapeCoventryCity from './EFL/CoventryCity/CoventryCity';
import scrapeDerbyCounty from './EFL/DerbyCounty/DerbyCounty';
import scrapeHullCity from './EFL/HullCity/HullCity';
import scrapeIpswichTown from './EFL/IpswichTown/IpswichTown';
import scrapeLeicesterCity from './EFL/LeicesterCity/LeicesterCity';
import scrapeMiddlesbrough from './EFL/Middlesbrough/Middlesbrough';
import scrapeMillwallFC from './EFL/MillwallFC/MillwallFC';
import scrapeNorwichCity from './EFL/NorwichCity/NorwichCity';
import scrapeOxfordUnited from './EFL/OxfordUnited/OxfordUnited';
import scrapePortsmouthFC from './EFL/PortsmouthFC/PortsmouthFC';
import scrapePrestonNE from './EFL/PrestonNE/PrestonNE';
import scrapeQPR from './EFL/QPR/QPR';
import scrapeSouthamptonFC from './EFL/SouthamptonFC/SouthamptonFC';
import scrapeStokeCity from './EFL/StokeCity/StokeCity';
import scrapeSwanseaCity from './EFL/SwanseaCity/SwanseaCity';
import scrapeWatfordFC from './EFL/WatfordFC/WatfordFC';
import scrapeWestBromwichAlbion from './EFL/WestBromwichAlbion/WestBromwichAlbion';
import scrapeWrexhamAFC from './EFL/WrexhamAFC/WrexhamAFC';

// — Liga AUF Uruguay —
import scrapeAlbionFC from './LigaAUFUruguay/AlbionFC/AlbionFC';
import scrapeBostonRiver from './LigaAUFUruguay/BostonRiver/BostonRiver';
import scrapeCentralEspanol from './LigaAUFUruguay/CentralEspañol/CentralEspañol';
import scrapeCerroUY from './LigaAUFUruguay/Cerro/Cerro';
import scrapeCerroLargo from './LigaAUFUruguay/CerroLargo/CerroLargo';
import scrapeClubDepMaldonado from './LigaAUFUruguay/ClubDepMaldonado/ClubDepMaldonado';
import scrapeDanubio from './LigaAUFUruguay/Danubio/Danubio';
import scrapeDefensorSporting from './LigaAUFUruguay/DefensorSporting/DefensorSporting';
import scrapeJuventud from './LigaAUFUruguay/Juventud/Juventud';
import scrapeLiverpoolUY from './LigaAUFUruguay/Liverpool/Liverpool';
import scrapeMontevideoCityTorque from './LigaAUFUruguay/MontevideoCityTorque/MontevideoCityTorque';
import scrapeMontevideoWanderers from './LigaAUFUruguay/MontevideoWanderers/MontevideoWanderers';
import scrapePenarol from './LigaAUFUruguay/Peñarol/Peñarol';
import scrapeProgreso from './LigaAUFUruguay/Progreso/Progreso';
import scrapeRacingClubUY from './LigaAUFUruguay/RacingClub/RacingClub';

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
  'Leeds United': scrapeLeedsUnited,
  'Luton Town': scrapeLutonTown,
  'Manchester City': scrapeManchesterCity,
  'Manchester United': scrapeManchesterUnited,
  'Newcastle United': scrapeNewcastleUnited,
  'Nottingham Forest': scrapeNottinghamForest,
  'Sheffield United': scrapeSheffieldUnited,
  'Sunderland AFC': scrapeSunderlandAFC,
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
  'Atlético Mineiro': scrapeAtleticoMineiro,
  'Athletico-PR': scrapeAthleticoPR,
  Bahia: scrapeBahia,
  Botafogo: scrapeBotafogo,
  'Red Bull Bragantino': scrapeBragantino,
  Corinthians: scrapeCorinthians,
  Cruzeiro: scrapeCruzeiro,
  Flamengo: scrapeFlamengo,
  Fluminense: scrapeFluminense,
  Fortaleza: scrapeFortaleza,
  Grêmio: scrapeGremio,
  Internacional: scrapeInternacional,
  Juventude: scrapeJuventude,
  Mirassol: scrapeMirassol,
  Novorizontino: scrapeNovorizontino,
  Palmeiras: scrapePalmeiras,
  'São Paulo': scrapeSaoPaulo,
  Santos: scrapeSantos,
  'Sport Recife': scrapeSportRecife,
  'Vasco da Gama': scrapeVasco,
  Vitória: scrapeVitoria,

  // Primera División
  'Arsenal de Sarandí': scrapeArsenalDeSarandí,
  'Atlético Tucumán': scrapeAtléticoTucumán,
  Banfield: scrapeBanfield,
  'Barracas Central': scrapeBarracasCentral,
  Belgrano: scrapeBelgrano,
  'Boca Juniors': scrapeBocaJuniors,
  'Central Córdoba': scrapeCentralCórdoba,
  'Defensa y Justicia': scrapeDefensaYJusticia,
  Estudiantes: scrapeEstudiantes,
  'Gimnasia y Esgrima LP': scrapeGimnasiaYEsgrimaLP,
  'Godoy Cruz': scrapeGodoyCruz,
  Huracán: scrapeHuracán,
  Independiente: scrapeIndependiente,
  Instituto: scrapeInstituto,
  Lanús: scrapeLanús,
  "Newell's Old Boys": scrapeNewellsOldBoys,
  Patronato: scrapePatronato,
  Platense: scrapePlatense,
  'Racing Club': scrapeRacingClub,
  'River Plate': scrapeRiverPlate,
  'Rosario Central': scrapeRosarioCentral,
  'San Lorenzo': scrapeSanLorenzo,
  'San Martín Tucumán': scrapeSanMartínTucumán,
  Sarmiento: scrapeSarmiento,
  Talleres: scrapeTalleres,
  Tigre: scrapeTigre,
  Unión: scrapeUnión,
  'Vélez Sarsfield': scrapeVélezSarsfield,

  // La Liga
  'Atlético Madrid': scrapeAtleticoMadrid,
  'Athletic Bilbao': scrapeAthleticBilbao,
  Alavés: scrapeAlaves,
  Barcelona: scrapeBarcelona,
  'Celta Vigo': scrapeCeltaVigo,
  Elche: scrapeElche,
  Espanyol: scrapeEspanyol,
  Getafe: scrapeGetafe,
  Girona: scrapeGirona,
  Levante: scrapeLevante,
  Mallorca: scrapeMallorca,
  Osasuna: scrapeOsasuna,
  'Rayo Vallecano': scrapeRayoVallecano,
  'Real Betis': scrapeRealBetis,
  'Real Madrid': scrapeRealMadrid,
  'Real Oviedo': scrapeRealOviedo,
  'Real Sociedad': scrapeRealSociedad,
  Sevilla: scrapeSevilla,
  Valencia: scrapeValencia,
  Villarreal: scrapeVillarreal,

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
  'Atlanta United FC': scrapeAtlantaUnited,
  'Austin FC': scrapeAustinFC,
  'CF Montréal': scrapeCFMontreal,
  'Charlotte FC': scrapeCharlotteFC,
  'Chicago Fire FC': scrapeChicagoFire,
  'Colorado Rapids': scrapeColoradoRapids,
  'Columbus Crew': scrapeColumbusCrew,
  'D.C. United': scrapeDCUnited,
  'FC Cincinnati': scrapeFCCincinnati,
  'FC Dallas': scrapeFCDallas,
  'Houston Dynamo FC': scrapeHoustonDynamo,
  'Inter Miami': scrapeInterMiami,
  'LA Galaxy': scrapeLAGalaxy,
  'Los Angeles FC': scrapeLosAngelesFC,
  'Minnesota United FC': scrapeMinnesotaUnited,
  'Nashville SC': scrapeNashvilleSC,
  'New England Revolution': scrapeNewEnglandRevolution,
  'New York City FC': scrapeNewYorkCityFC,
  'New York Red Bulls': scrapeNewYorkRedBulls,
  'Orlando City SC': scrapeOrlandoCitySC,
  'Philadelphia Union': scrapePhiladelphiaUnion,
  'Portland Timbers': scrapePortlandTimbers,
  'Real Salt Lake': scrapeRealSaltLake,
  'San Diego FC': scrapeSanDiegoFC,
  'San Jose Earthquakes': scrapeSanJoseEarthquakes,
  'Seattle Sounders FC': scrapeSeattleSounders,
  'Sporting Kansas City': scrapeSportingKansasCity,
  'St. Louis City SC': scrapeStLouisCitySC,
  'Toronto FC': scrapeTorontoFC,
  'Vancouver Whitecaps FC': scrapeVancouverWhitecaps,

  // Ligue 1
  Marseille: scrapeMarseille,
  Monaco: scrapeMonaco,
  'Olympique Lyonnais': scrapeOlympiqueLyonnais,
  'Paris Saint-Germain': scrapePSG,

  // Liga MX
  'Atlas FC': scrapeAtlasFC,
  'Atlético de San Luis': scrapeAtleticoSanLuis,
  'CF Monterrey': scrapeCFMonterrey,
  'CF Pachuca': scrapeCFPachuca,
  'Chivas Guadalajara': scrapeChivas,
  'Club América': scrapeClubAmerica,
  'Club Puebla': scrapeClubPuebla,
  'Club Tijuana': scrapeClubTijuana,
  'Cruz Azul': scrapeCruzAzul,
  'Deportivo Toluca': scrapeDeportivoToluca,
  'FC Juárez': scrapeFCJuarez,
  'León FC': scrapeLeonFC,
  'Mazatlán FC': scrapeMazatlanFC,
  Necaxa: scrapeNecaxa,
  'Pumas UNAM': scrapePumasUNAM,
  'Querétaro FC': scrapeQueretaroFC,
  'Santos Laguna': scrapeSantosLaguna,
  'Tigres UNAM': scrapeTigresUNAM,

  // Primeira Liga
  Arouca: scrapeArouca,
  AVS: scrapeAVS,
  Benfica: scrapeBenfica,
  Boavista: scrapeBoavista,
  Braga: scrapeBraga,
  'Casa Pia': scrapeCasaPia,
  'Estrela da Amadora': scrapeEstrelaAmadora,
  'Estoril Praia': scrapeEstorilPraia,
  Famalicão: scrapeFamalicão,
  Farense: scrapeFarense,
  'Gil Vicente': scrapeGilVicente,
  Moreirense: scrapeMoreirense,
  Nacional: scrapeNacional,
  Porto: scrapePorto,
  'Rio Ave': scrapeRioAve,
  'Santa Clara': scrapeSantaClara,
  'Sporting CP': scrapeSpotingCP,
  'Vitória SC': scrapeVitóriaSC,

  // EFL Championship
  'Blackburn Rovers': scrapeBlackburnRovers,
  'Birmingham City': scrapeBirminghamCity,
  'Bristol City': scrapeBristolCity,
  'Cardiff City': scrapeCardiffCity,
  'Charlton Athletic': scrapeCharltonAthletic,
  'Coventry City': scrapeCoventryCity,
  'Derby County': scrapeDerbyCounty,
  'Hull City': scrapeHullCity,
  'Ipswich Town': scrapeIpswichTown,
  'Leicester City': scrapeLeicesterCity,
  Middlesbrough: scrapeMiddlesbrough,
  'Millwall FC': scrapeMillwallFC,
  'Norwich City': scrapeNorwichCity,
  'Oxford United': scrapeOxfordUnited,
  'Portsmouth FC': scrapePortsmouthFC,
  'Preston North End': scrapePrestonNE,
  QPR: scrapeQPR,
  'Southampton FC': scrapeSouthamptonFC,
  'Stoke City': scrapeStokeCity,
  'Swansea City': scrapeSwanseaCity,
  'Watford FC': scrapeWatfordFC,
  'West Bromwich Albion': scrapeWestBromwichAlbion,
  'Wrexham AFC': scrapeWrexhamAFC,

  // Eredivisie
  Ajax: scrapeAjax,
  AZ: scrapeAZ,
  'FC Twente': scrapeFCTwente,
  'FC Utrecht': scrapeFCUtrecht,
  Feyenoord: scrapeFeyenoord,
  NEC: scrapeNEC,
  'PSV Eindhoven': scrapePSVEindhoven,
  'SC Heerenveen': scrapeSCHeerenveen,

  // Liga AUF Uruguay
  'CA Peñarol': scrapePenarol,
  'Club Nacional': scrapeNacional,
  'Liverpool FC Montevideo': scrapeLiverpoolUY,
  'Defensor Sporting': scrapeDefensorSporting,
  'CA Juventud': scrapeJuventud,
  'Racing Club de Montevideo': scrapeRacingClubUY,
  'Montevideo City Torque': scrapeMontevideoCityTorque,
  'Montevideo Wanderers': scrapeMontevideoWanderers,
  'CA Boston River': scrapeBostonRiver,
  'Central Español FC': scrapeCentralEspanol,
  'Club Deportivo Maldonado': scrapeClubDepMaldonado,
  'Albion FC': scrapeAlbionFC,
  'Cerro Largo FC': scrapeCerroLargo,
  'CA Progreso': scrapeProgreso,
  'Danubio FC': scrapeDanubio,
  'CA Cerro': scrapeCerroUY,
};
