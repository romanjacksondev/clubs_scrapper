import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeSheffieldUnited = async () => {
  const url = 'https://www.sufcdirect.co.uk/kit/all-kits/all-kits/';
};

export default scrapeSheffieldUnited;
