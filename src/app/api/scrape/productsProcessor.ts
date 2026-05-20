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

  // 1. Fetch all existing active products in one query
  const existingProducts = await prisma.product.findMany({
    where: { clubId, deletedAt: null },
  });
  const existingByName = new Map(existingProducts.map((p) => [p.name.toLowerCase(), p]));

  // 2. Classify incoming products into creates vs updates
  type NewProduct = {
    name: string;
    price: number;
    currency: string;
    productUrl: string;
    clubId: number;
  };
  const toCreate: NewProduct[] = [];
  const toUpdate: Array<{
    id: number;
    price: number;
    currency: string;
    productUrl: string;
    priceChanged: boolean;
  }> = [];

  for (const product of data) {
    const currency = product.currency ?? 'USD';
    const existing = existingByName.get(product.name.toLowerCase());
    if (existing) {
      toUpdate.push({
        id: existing.id,
        price: product.price,
        currency,
        productUrl: product.productUrl,
        priceChanged: existing.price !== product.price,
      });
    } else {
      toCreate.push({
        name: product.name,
        price: product.price,
        currency,
        productUrl: product.productUrl,
        clubId,
      });
    }
  }

  // 3. Batch-create new products and their initial history in a transaction
  if (toCreate.length > 0) {
    const created = await prisma.product.createManyAndReturn({ data: toCreate });
    await prisma.productHistory.createMany({
      data: created.map((p) => ({ productId: p.id, price: p.price, currency: p.currency })),
    });
  }

  // 4. Batch-update existing products and record history only for price changes
  const historyEntries = toUpdate
    .filter((u) => u.priceChanged)
    .map((u) => ({ productId: u.id, price: u.price, currency: u.currency }));

  await prisma.$transaction([
    ...toUpdate.map((u) =>
      prisma.product.update({
        where: { id: u.id },
        data: { price: u.price, currency: u.currency, productUrl: u.productUrl },
      }),
    ),
    ...(historyEntries.length > 0
      ? [prisma.productHistory.createMany({ data: historyEntries })]
      : []),
  ]);

  // 5. Handle products no longer returned by the scraper — grace period of 3 days
  //    before soft-deleting, to avoid losing products that are temporarily unavailable.
  const now = new Date();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const missingProducts = existingProducts.filter((p) => !returnedNames.has(p.name.toLowerCase()));

  const toSoftDelete = missingProducts
    .filter(
      (p) => p.missingSince != null && now.getTime() - p.missingSince.getTime() >= THREE_DAYS_MS,
    )
    .map((p) => p.id);

  const toMarkMissing = missingProducts.filter((p) => p.missingSince == null).map((p) => p.id);

  // Clear missingSince for products that came back
  const returnedWithMissing = existingProducts
    .filter((p) => returnedNames.has(p.name.toLowerCase()) && p.missingSince != null)
    .map((p) => p.id);

  await Promise.all([
    toSoftDelete.length > 0
      ? prisma.product.updateMany({ where: { id: { in: toSoftDelete } }, data: { deletedAt: now } })
      : Promise.resolve(),
    toMarkMissing.length > 0
      ? prisma.product.updateMany({
          where: { id: { in: toMarkMissing } },
          data: { missingSince: now },
        })
      : Promise.resolve(),
    returnedWithMissing.length > 0
      ? prisma.product.updateMany({
          where: { id: { in: returnedWithMissing } },
          data: { missingSince: null },
        })
      : Promise.resolve(),
  ]);

  // 6. Return the up-to-date DB records
  return prisma.product.findMany({
    where: { clubId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}
