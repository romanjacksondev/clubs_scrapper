// productsProcessor.ts
import { prisma } from '../../../lib/prisma';

export async function processProducts(data: any[], club: string) {
  // Find the clubId for the given club name (case-insensitive)
  const clubRecord = await prisma.club.findFirst({
    where: { name: { equals: club, mode: 'insensitive' } },
  });
  if (!clubRecord) {
    throw new Error('Club not found in DB');
  }

  // Upsert each product (avoid duplicates by name and clubId)
  for (const product of data) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: product.name,
        clubId: clubRecord.id,
      },
    });
    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          price: product.price,
          productUrl: product.productUrl,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          productUrl: product.productUrl,
          clubId: clubRecord.id,
        },
      });
    }
  }
}
