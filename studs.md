# Stub Scrapers — Teams with No Functioning Scraper

> Last updated: 30 May 2026 — **125 teams** across 12 leagues.

---

## Brasileirão Série A (Brazil) (6 teams)

> Implemented this session: Atlético Mineiro (lojadogalo.com.br VTEX cat 42), Bragantino (redbullshop.com.br VTEX path-search), Grêmio (loja.gremiomania.com.br VTEX cat 33), Internacional (lojadointer.com.br Netshoes), Juventude (moderniza.me/juventude WooCommerce), Santos (santosstore.com.br Netshoes)

| Team          | Reason                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Bahia         | Real store at lojaesquadrao.com.br — returns HTTP 403 (Cloudflare bot protection) from non-Brazilian IPs. |
| Fortaleza     | loja.fortalezaec.com.br — connection refused from outside Brazil; no alternative store domain found.      |
| Mirassol      | mirassolfc.com.br uses Shopify but has 0 products listed (store not stocked / under construction).        |
| Novorizontino | novorizontino.com.br — completely unreachable from outside Brazil (DNS/TCP failure).                      |
| Sport Recife  | www.sportrecife.com.br returns HTTP 403; loja.sport.com.br unreachable. No accessible store domain found. |
| Vitória       | loja.ecvitoria.com.br returns HTTP 530 (Cloudflare origin error). lojavitoria.com.br is a parked domain.  |

## Bundesliga (Germany) (1 team)

> Implemented: 1FC Heidenheim (Puppeteer), Bayer Leverkusen (Playwright/de-DE), Borussia Dortmund (Puppeteer), Borussia Mönchengladbach (fetch+Cheerio), FC Augsburg (fetch+Cheerio), RB Leipzig (fetch+Cheerio), VfB Stuttgart (fetch+RSC JSON), Werder Bremen (fetch+Cheerio)

| Team          | Reason                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bayern Munich | FC Bayern München official store (fcbayern.com/store) — Scayle platform. Akamai geo-block: all jersey category URLs return HTTP 403 from non-EU IPs. Needs EU VPS (e.g., Hetzner Frankfurt) to scrape. |

## EFL Championship (England) (5 teams)

> Implemented: Birmingham City (JonasSports), Blackburn Rovers (roverstore.co.uk PHP JSON API), Bristol City (JonasSports), Cardiff City (JonasSports/sitemap), Hull City (JonasSports/sitemap), Ipswich Town (Shopify), Middlesbrough (JonasSports), Norwich City (JonasSports), Oxford United (JonasSports), Portsmouth FC (Playwright/nopCommerce), Preston NE (Shopify), QPR (Shopify — 0 kits stocked), Southampton FC (JonasSports), Stoke City (JonasSports — 0 kits stocked), Swansea City (Shopify), Watford FC (JonasSports), West Bromwich Albion (JonasSports), Wrexham AFC (Shopify)

| Team              | Reason                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Charlton Athletic | Charlton Athletic official store (clubshop.cafc.co.uk) — Shopify. Store is accessible but has no current replica kits; only retro shirts and accessories are stocked.                      |
| Coventry City     | Coventry City official store (shop.ccfc.co.uk) — network-unreachable from non-UK IPs; connection fails or navigation errors consistently.                                                  |
| Derby County      | Derby County official store (www.dcfcmegastore.co.uk) — Akamai EdgeSuite protection. Returns HTTP 403 even from Playwright; geo-blocked from non-UK IPs.                                   |
| Leicester City    | Leicester City official store (shop.lcfc.com) — Shopify with Cloudflare Bot Management. Products are client-side rendered and never appear in DOM after JS load; Shopify JSON API blocked. |
| Millwall FC       | Millwall FC official store (shop.millwallfc.co.uk) — Akamai EdgeSuite protection. Returns HTTP 403 even from Playwright; geo-blocked from non-UK IPs.                                      |

## La Liga (Spain) (2 teams)

> ✅ Implemented via Playwright: Getafe (Magento 1.x), Osasuna (Magento 2), Alavés (PrestaShop), Real Sociedad (PrestaShop), Rayo Vallecano (PrestaShop)
> ✅ Implemented via fetch: Athletic Bilbao (Shopify kits), Atlético Madrid (SFCC LD+JSON), Barcelona (Shopify kits), Elche (WooCommerce), Espanyol (PrestaShop SSR fetch+cheerio), Girona (WooCommerce), Levante (Shopify equipacions), Mallorca (Shopify equipaciones), Real Betis (Shopify equipaciones), Real Madrid (Shopify jerseys-kits), Sevilla (Shopify equipaciones-25-26), Valencia (Magento LD+JSON), Villarreal (Shopify equipaciones)

| Team        | Reason                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------- |
| Celta Vigo  | Real store at tienda.celtavigo.net — Sucuri WAF blocks all requests from non-Spanish IPs. |
| Real Oviedo | Real store at realoviedo.shop — returns HTTP 403 to all external requests (geo-blocked).  |

## Liga AUF Uruguay (16 teams)

| Team                   | Reason                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- |
| Albion FC              | No accessible public store found — stub                                          |
| Boston River           | No accessible public store found — stub                                          |
| Central Español        | No accessible public store found — stub                                          |
| Cerro                  | Store not yet identified.                                                        |
| Cerro Largo            | No accessible public store found — stub                                          |
| Club Dep Maldonado     | No accessible public store found — stub                                          |
| Danubio                | Store not yet identified.                                                        |
| Defensor Sporting      | No accessible public store found — stub                                          |
| Juventud               | No accessible public store found — stub                                          |
| Liverpool              | Store not yet identified.                                                        |
| Montevideo City Torque | Store not yet identified.                                                        |
| Montevideo Wanderers   | No accessible public store found — stub                                          |
| Nacional               | Domain nacional.com.uy does not resolve from external servers — stub             |
| Peñarol                | Store not yet identified.                                                        |
| Progreso               | No accessible public store found — stub                                          |
| Racing Club            | WooCommerce Store API — small catalog (~27 products), no category filter needed. |

## Liga MX (Mexico) (12 teams)

> ✅ Implemented via fetch: Atlas FC (shop.atlasfc.com.mx Shopify /collections/jersey), Chivas Guadalajara (tiendachivas.com.mx BigCommerce search page), Cruz Azul (tiendacruzazul.mx Shopify /collections/jersey), FC Juárez (bravotienda.com Shopify /collections/jersey-25-26), Pumas UNAM (tiendapumas.com Shopify /collections/jerseys), Tigres UNAM (tigretienda.com Shopify /collections/playera)

| Team              | Reason                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Atletico San Luis | Atlético de San Luis official store — atleticosanluis.com. WordPress DB error (HTTP 500); no accessible products.            |
| CF Monterrey      | CF Monterrey (Rayados) official store — tiendarayados.com. Cloudflare-protected; all programmatic requests receive HTTP 403. |
| CF Pachuca        | CF Pachuca (Tuzos) official store — tuzos.com.mx. Returns HTTP 403 Access Denied to all programmatic requests.               |
| Club America      | Club América official store — tiendaclubamerica.com.mx. Domain is unresolvable (DNS failure).                                |
| Club Puebla       | Club Puebla official store — clubpuebla.com. Returns HTTP 530 / Cloudflare error 1016 to all requests.                       |
| Club Tijuana      | Club Tijuana (Xoloitzcuintles) — xoloitzcuintles.com and all known subdomains timeout (geo-block/WAF).                       |
| Deportivo Toluca  | Deportivo Toluca FC — deportivotoluca.mx and all known subdomains timeout (no accessible store found).                       |
| Leon FC           | León FC — clubleon.com and all known subdomains timeout (geo-block/WAF).                                                     |
| Mazatlan FC       | Mazatlán FC — mazatlanfc.com. No accessible public store; all known subdomains return 404 or DNS failure.                    |
| Necaxa            | Necaxa — clubnecaxa.com. No accessible public store; products.json returns 404.                                              |
| Queretaro FC      | Querétaro FC (Gallos Blancos) — gallos.mx returns HTTP 403; all known subdomain attempts fail.                               |
| Santos Laguna     | Santos Laguna — santoslaguna.com.mx and all known subdomains timeout (no accessible store found).                            |

## Ligue 1 (France) (4 teams)

| Team               | Reason                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Marseille          | Olympique de Marseille official store (boutique.om.fr) — Shopify. Uses the Shopify /products.json API for the home (domicile-flocage)           |
| Monaco             | AS Monaco official store (shop.asmonaco.com) — Shopify. Uses the Shopify /products.json API for the kits collection,                            |
| Olympique Lyonnais | Olympique Lyonnais official store (boutique.ol.fr) — custom PrestaShop. The store exposes an AJAX endpoint for category pages that returns JSON |
| PSG                | Paris Saint-Germain official store (shop.psg.fr) — Fanatics platform. The store is protected by Akamai bot detection and returns HTTP 403       |

## MLS (USA/Canada) (30 teams)

| Team                   | Reason                                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atlanta United         | Atlanta United FC official store: shop.atlutd.com / www.mlsstore.com/atlanta-united (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                         |
| Austin FC              | Austin FC official store: www.mlsstore.com/austin-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                                        |
| CF Montreal            | CF Montréal official store: boutique.cfmontreal.com / www.mlsstore.com/cf-montreal (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                          |
| Charlotte FC           | Charlotte FC official store: shop.charlottefc.com / www.mlsstore.com/charlotte-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                           |
| Chicago Fire           | Chicago Fire FC official store: store.chicagofire.com / www.mlsstore.com/chicago-fire-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                    |
| Colorado Rapids        | Colorado Rapids official store: store.coloradorapids.com / www.mlsstore.com/colorado-rapids (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                 |
| ColumbusСrew           | Columbus Crew official store: store.columbuscrew.com / www.mlsstore.com/columbus-crew (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                       |
| DC United              | D.C. United official store: shop.dcunited.com / www.mlsstore.com/dc-united (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                  |
| FC Cincinnati          | FC Cincinnati official store: store.fccincinnati.com / www.mlsstore.com/fc-cincinnati (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                       |
| FC Dallas              | FC Dallas official store: store.fcdallas.com / www.mlsstore.com/fc-dallas (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                   |
| Houston Dynamo         | Houston Dynamo FC official store: store.houstondynamo.com / www.mlsstore.com/houston-dynamo (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                 |
| Inter Miami            | Inter Miami CF official store: www.mlsstore.com/inter-miami-cf (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                              |
| LA Galaxy              | LA Galaxy official store: www.mlsstore.com/la-galaxy (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                                        |
| Los Angeles FC         | Los Angeles FC (LAFC) official store: store.lafc.com / www.mlsstore.com/los-angeles-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                      |
| Minnesota United       | Minnesota United FC official store: store.mnufc.com / www.mlsstore.com/minnesota-united-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                  |
| Nashville SC           | Nashville SC official store: store.nashvillesc.com / www.mlsstore.com/nashville-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                          |
| New England Revolution | New England Revolution official store: store.revolutionsoccer.net / www.mlsstore.com/new-england-revolution (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager — |
| New York City FC       | New York City FC official store: www.mlsstore.com/new-york-city-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                          |
| New York Red Bulls     | New York Red Bulls official store: store.newyorkredbulls.com / www.mlsstore.com/new-york-red-bulls (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —          |
| Orlando City SC        | Orlando City SC official store: store.orlandocitysc.com / www.mlsstore.com/orlando-city-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                  |
| Philadelphia Union     | Philadelphia Union official store: store.philadelphiaunion.com / www.mlsstore.com/philadelphia-union (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —        |
| Portland Timbers       | Portland Timbers official store: store.timbers.com / www.mlsstore.com/portland-timbers (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                      |
| Real Salt Lake         | Real Salt Lake official store: store.realsaltlake.com / www.mlsstore.com/real-salt-lake (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                     |
| San Diego FC           | San Diego FC official store: store.sandiegofc.com / www.mlsstore.com/san-diego-fc (Fanatics). Expansion club joining MLS in 2025.                                                                  |
| San Jose Earthquakes   | San Jose Earthquakes official store: store.sjearthquakes.com / www.mlsstore.com/san-jose-earthquakes (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —        |
| Seattle Sounders       | Seattle Sounders FC official store: store.soundersfc.com / www.mlsstore.com/seattle-sounders-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —             |
| Sporting Kansas City   | Sporting Kansas City official store: store.sportingkc.com / www.mlsstore.com/sporting-kansas-city (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —           |
| St Louis City SC       | St. Louis City SC official store: store.stlouiscitysc.com / www.mlsstore.com/st-louis-city-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —               |
| Toronto FC             | Toronto FC official store: shop.torontofc.ca / www.mlsstore.com/toronto-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                  |
| Vancouver Whitecaps    | Vancouver Whitecaps FC official store: store.whitecapsfc.com / www.mlsstore.com/vancouver-whitecaps-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —      |

## Premier League (England) (3 teams)

> ✅ Implemented: Arsenal (JD Sports SSR HTML), Bournemouth (SSR .ProductCell), Brentford (Shopify), Brighton (Shopify), Chelsea (Fanatics /api/product-data Puppeteer), Crystal Palace (Shopify), Everton (SFCC LD+JSON), Liverpool (Magento 2 stealth Puppeteer), Sheffield United (JonasSports AJAX API), Tottenham Hotspur (SFCC GlobalE cookie)

| Team           | Reason                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Aston Villa    | shop.avfc.co.uk — Akamai/Imperva geo-block. Returns HTTP 403 “Access Denied” to all requests including headless browser from non-UK IPs. |
| Leeds United   | shop.leedsunited.com — Akamai EdgeSuite geo-block. Returns HTTP 403 “Access Denied” to all requests from non-UK IPs.                     |
| Sunderland AFC | www.safcstore.com — Akamai EdgeSuite geo-block. Returns HTTP 403 “Access Denied” to all requests from non-UK IPs.                        |

## Primeira Liga (Portugal) (15 teams)

> ✅ Implemented: SportingCP (lojaverde.sporting.pt — NopCommerce; `/api/category/getProductsByCategory/13` paginated)

| Team            | Reason                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AVS             | AVS Futebol SAD official store: no accessible online store found. This club (formerly Vitória de Setúbal) has no identifiable public product API.                                |
| Arouca          | FC Arouca official store: fcarouca.pt/loja (SSL certificate issues when accessed externally) The store cannot be verified programmatically due to SSL configuration.             |
| Boavista        | Boavista FC official store: boavistafc.pt/loja/ The store is embedded in the club's WordPress site and does not expose a public                                                  |
| Braga           | SC Braga official store: store.scbraga.pt The store is WooCommerce but the store/v1 API is disabled (404) and v3 API requires authentication (401).                              |
| Casa Pia        | Casa Pia AC official store: casapiaac.pt/loja (2PLAY custom platform). Third-party training supplier desportiva.pt has some items but is not the official fan merch store.       |
| Estoril Praia   | Estoril Praia official store: lojaoficial.ligaportugal.pt (Liga Portugal official store) Products are sold via the Liga Portugal multi-club store; no club-specific product API. |
| Estrela Amadora | Estrela da Amadora official store: no accessible online store found. Domain candidates (estreladaamadora.pt, estreladaamadora.com) are not resolvable.                           |
| Famalicão       | FC Famalicão official store: no accessible online store found. The official site (fcfamalicao.com) redirects to a portal page with no product API.                               |
| Farense         | SC Farense official store: scfarense.pt/store/ exists but returns HTTP 500 (internal server error); WooCommerce/Shopify APIs also return 500.                                    |
| Gil Vicente     | Gil Vicente FC official store: no accessible online store found. The official domain (gilvicente.pt) does not resolve from outside Portugal.                                     |
| Moreirense      | Moreirense FC official store: no accessible online store found. The official site (moreirensefc.pt) does not link to an online store.                                            |
| Nacional        | CD Nacional (Madeira) official store: cdnacional.pt/loja/ The store is a WordPress/WooCommerce site; the WooCommerce REST API requires                                           |
| Rio Ave         | Rio Ave FC official store: rioavefc.pt/loja/ The store is embedded in the club's WordPress site and does not expose a public                                                     |
| Santa Clara     | CD Santa Clara official store: no accessible online store found. The official site (cdsantaclara.pt) does not expose a public product API.                                       |
| Vitória SC      | Vitória SC (Guimarães) official store: loja.vitoriasc.pt The store is WooCommerce but the store/v1 API returns rest_no_route (disabled).                                         |

## Primera División (Argentina) (16 teams)

> ✅ Implemented: Estudiantes (TiendaNube /indumentaria, 27 products), Instituto (TiendaNube /indumentaria, 62 products), Tigre (TiendaNube /indumentaria, 135 products), Vélez Sarsfield (TiendaNube /productos, 12 products), Lanús (WooCommerce store/v1, 371 products), Unión (custom PHP HTML scraper, 12 products)
> ℹ️ Was already working: Independiente (TiendaNube /camisetas, 12 products)

| Team                  | Reason                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Arsenal De Sarandí    | Arsenal de Sarandí official store: no accessible online store found. All known domain candidates (arsenal-fc.com.ar, tienda.arsenal-fc.com.ar) are not resolvable. |
| Atlético Tucumán      | Atlético Tucumán official store: no accessible online store found. atleticotucuman.com is a parked domain for sale; no club store is accessible.                   |
| Banfield              | Banfield official store: no accessible online store found. Domain candidates (tiendabanfield.com.ar, clubbanfield.com.ar) are not resolvable.                      |
| Barracas Central      | Barracas Central official store: no accessible online store found. The official site (barracascentral.com) does not link to an online store.                       |
| Belgrano              | Belgrano official store: no accessible online store found. The official site (cabelgrano.com.ar) has SSL issues and does not expose a product API.                 |
| Central Córdoba       | Central Córdoba (Santiago del Estero) official store: no accessible online store found. The official site (centralcordoba.com.ar) does not expose a product API.   |
| Defensa Y Justicia    | Defensa y Justicia official store: no accessible online store found. All known domain candidates are not resolvable from outside Argentina.                        |
| Gimnasia Y Esgrima LP | Gimnasia y Esgrima La Plata official store: no accessible online store found. Domain candidates (gimnasiaylp.com.ar, tiendaginmasia.com.ar) are not resolvable.    |
| Godoy Cruz            | Godoy Cruz official store: no accessible online store found. Domain candidates (tiendagodoycruz.com.ar, godoycruztomba.com) are not resolvable.                    |
| Huracán               | Huracán official store (tiendahuracan.com.ar). The store is currently unreachable (DNS / server offline).                                                          |
| Newells Old Boys      | Newell's Old Boys official store: no accessible online store found. Domain candidates (tiendanob.com.ar, tiendanewells.com.ar) are not resolvable.                 |
| Patronato             | Patronato (Paraná) official store: no accessible online store found. Domain candidates (patronato.com.ar, tiendapatronato.com.ar) are not resolvable.              |
| Platense              | Platense official store: no accessible online store found. The official site (clubplatense.net) does not link to an online store.                                  |
| San Martín Tucumán    | San Martín de Tucumán official store: no accessible online store found. No public product API has been identified for this club.                                   |
| Sarmiento             | Sarmiento (Junín) official store: no accessible online store found. Domain candidates (tiendasarmiento.com.ar, clubsarmiento.com) return 404.                      |
| Talleres              | Talleres (Córdoba) official store: no accessible online store found. Domain candidates (tiendatalleres.com.ar, talleres.net) are not resolvable.                   |

## Serie A (Italy) (14 teams)

| Team          | Reason                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC Milan      | Shopify store — milan-match-kit covers all match kit products for men/women/kids.                                                                                                  |
| AS Roma       | Shopify store — kit-gara covers all match-day kits (home/away/third).                                                                                                              |
| Atalanta      | Custom platform (officialstore.it). Products are rendered server-side with data-product-\* attributes on each product card.                                                        |
| Bologna       | Fanatics Italy platform (bolognafcstore.com) — SSR with React/Next.js. The top-level /it/kit-gara page only lists sub-categories; individual products                              |
| Fiorentina    | Fanatics Italy platform (fiorentinastore.com) — SSR with React/Next.js. The top-level /it/kit-gara page only lists sub-categories; individual products                             |
| Genoa         | WooCommerce store (genoacfc.it) — custom theme using card-product class. The top-level kit-gara category page lists sub-category links                                             |
| Hellas Verona | Shopify store (store.hellasverona.it) — Cloudflare-protected. Uses the Shopify /products.json API with browser-like headers.                                                       |
| Inter Milan   | Fanatics Italy platform (store.inter.it) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (including gender sub-pages);             |
| Juventus      | Fanatics Italy platform (store.juventus.com) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (including gender sub-pages);         |
| Lazio         | Fanatics Italy platform (www.laziostylestore.com) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (home, away, third, goalkeeper); |
| Lecce         | US Lecce official store (www.usleccestore.it) — Shopify. Uses the Shopify /products.json API with browser-like headers.                                                            |
| Monza         | AC Monza official store (zeroplayer.it) — Shopify multi-brand store. Kit items are under the new-maglie-gare-ac-monza collection.                                                  |
| Napoli        | SSC Napoli official store (store.sscnapoli.it) — Shopify. Uses the Shopify /products.json API with browser-like headers.                                                           |
| Torino        | Torino FC official store (torinofcstore.com) — PrestaShop. Product data is embedded in the page as a `wk_category_products` JS variable.                                           |
