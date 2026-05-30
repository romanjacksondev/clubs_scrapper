import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client';

// Load .env only in local development; on Vercel env vars are injected directly.
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const _url = process.env.DATABASE_URL ?? '';
const _ssl =
  _url.includes('localhost') || _url.includes('127.0.0.1') ? false : { rejectUnauthorized: false };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString: _url, ssl: _ssl }) });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
