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
  // Upsert each product atomically — a failure mid-loop rolls back all writes
  await prisma.$transaction(
    async (tx) => {
      for (const product of data) {
        const existingProduct = await tx.product.findFirst({
          where: {
            name: { equals: product.name, mode: 'insensitive' },
            clubId,
          },
        });
        const currency = product.currency ?? 'USD';
        if (existingProduct) {
          await tx.product.update({
            where: { id: existingProduct.id },
            data: { price: product.price, currency, productUrl: product.productUrl },
          });
          // Only record a history snapshot when the price has changed
          if (existingProduct.price !== product.price) {
            await tx.productHistory.create({
              data: { productId: existingProduct.id, price: product.price, currency },
            });
          }
        } else {
          const created = await tx.product.create({
            data: {
              name: product.name,
              price: product.price,
              currency,
              productUrl: product.productUrl,
              clubId,
            },
          });
          // Record the initial price in history
          await tx.productHistory.create({
            data: { productId: created.id, price: created.price, currency: created.currency },
          });
        }
      }
    },
    { timeout: 30000 },
  );

  // Return the up-to-date DB records (with id, updatedAt, etc.)
  return prisma.product.findMany({
    where: { clubId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}
