// productsProcessor.ts
import { prisma } from '../../../lib/prisma';
import { Product } from '../../../types/Product';

const HISTORY_RETENTION_DAYS = 90;

export async function purgeOldHistory() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - HISTORY_RETENTION_DAYS);
  await prisma.productHistory.deleteMany({
    where: { recordedAt: { lt: cutoff } },
  });
}

export async function processProducts(data: Product[], clubId: number) {
  // Upsert each product (avoid duplicates by name and clubId, case-insensitive)
  for (const product of data) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: { equals: product.name, mode: 'insensitive' },
        clubId,
      },
    });
    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          price: product.price,
          currency: product.currency ?? 'USD',
          productUrl: product.productUrl,
        },
      });
      // Only record a history snapshot when the price has changed
      if (existingProduct.price !== product.price) {
        await prisma.productHistory.create({
          data: { productId: existingProduct.id, price: product.price },
        });
      }
    } else {
      const created = await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          currency: product.currency ?? 'USD',
          productUrl: product.productUrl,
          clubId,
        },
      });
      // Record the initial price in history
      await prisma.productHistory.create({
        data: { productId: created.id, price: created.price },
      });
    }
  }

  // Return the up-to-date DB records (with id, updatedAt, etc.)
  return prisma.product.findMany({
    where: { clubId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}
