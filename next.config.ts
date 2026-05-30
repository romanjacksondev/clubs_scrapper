import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'playwright',
    'playwright-core',
    'puppeteer',
    'puppeteer-core',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth',
    '@sparticuz/chromium',
    'typescript',
  ],
};

export default nextConfig;
