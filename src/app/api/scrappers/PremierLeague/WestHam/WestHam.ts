import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeWestHam = async () => {
  const url = 'https://shop.whufc.com/kits/all-kit/';
};

export default scrapeWestHam;
