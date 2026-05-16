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
  const returnedNames = new Set(data.map((p) => p.name.toLowerCase()));

  // Upsert each product atomically — a failure mid-loop rolls back all writes.
  // At the end of the transaction, products no longer returned by the scraper are soft-deleted.
  await prisma.$transaction(
    async (tx) => {
      for (const product of data) {
        const existingProduct = await tx.product.findFirst({
          where: {
            name: { equals: product.name, mode: 'insensitive' },
            clubId,
            deletedAt: null,
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

      // Soft-delete products that were not returned by this scrape run
      const activeProducts = await tx.product.findMany({
        where: { clubId, deletedAt: null },
        select: { id: true, name: true },
      });
      const staleIds = activeProducts
        .filter((p) => !returnedNames.has(p.name.toLowerCase()))
        .map((p) => p.id);
      if (staleIds.length > 0) {
        await tx.product.updateMany({
          where: { id: { in: staleIds } },
          data: { deletedAt: new Date() },
        });
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
