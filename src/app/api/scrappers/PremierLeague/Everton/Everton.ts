const BASE_URL = 'https://store.evertonfc.com';
// Everton store runs on Salesforce Commerce Cloud (SFCC) with an Iris React frontend.
// The kit product listing is embedded as JSON in the second "items" array of the
// Search-Show page (loads without bot-protection on the demandware path).
// Price used: current sale/clearance if present, otherwise regular price.

const scrapeEverton = async function () {
  try {
    const res = await fetch(
      `${BASE_URL}/on/demandware.store/Sites-evertonfc-Site/en_GB/Search-Show?cgid=kits`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
    );
    const html = await res.text();

    // Products are in the second "items":[ array — the first is a "What's New" carousel
    const firstIdx = html.indexOf('"items":[');
    const secondIdx = html.indexOf('"items":[', firstIdx + 1);
    if (secondIdx === -1) return [];

    // Extract the array content
    let depth = 0;
    let end = secondIdx + 9;
    while (end < html.length) {
      if (html[end] === '[') depth++;
      else if (html[end] === ']') {
        if (depth === 0) break;
        depth--;
      }
      end++;
    }
    const items: any[] = JSON.parse(html.substring(secondIdx + 8, end + 1));

    return items
      .map((item: any) => {
        const name: string = item.title?.trim();
        const relUrl: string = item.url?.trim();
        if (!name || !relUrl) return null;
        const productUrl = `${BASE_URL}/${relUrl}`;
        // Use the lowest available price: clearance > sale > regular
        const priceStr =
          item.price?.clearance?.money?.userCurrencyValue ||
          item.price?.sale?.money?.userCurrencyValue ||
          item.price?.regular?.money?.userCurrencyValue;
        const price = parseFloat(priceStr);
        if (!price) return null;
        return { name, productUrl, price, currency: 'GBP' };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  } catch (e) {
    console.error('Error in scrapeEverton:', e);
    return [];
  }
};

export default scrapeEverton;
