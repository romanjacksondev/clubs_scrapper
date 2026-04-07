import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const scrapeNewcastle = async () => {
  const urls = [
    'https://shop.newcastleunited.com/collections/all-25-26-home-kit',
    'https://shop.newcastleunited.com/collections/all-25-26-away-kit',
    'https://shop.newcastleunited.com/collections/all-25-26-third-kit',
  ];
};

export default scrapeNewcastle;
