
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  let { league, club } = await request.json();
  // Remove spaces for folder/file matching
  league = league.replace(/\s+/g, "");
  club = club.replace(/\s+/g, "");
  console.log('Launching scrapper for:', { league, club });
  if (!league || !club) {
    return NextResponse.json({ error: 'Missing league or club' }, { status: 400 });
  }

  // Dynamically import the scrapper based on league and club
  try {
    const scrapperPath = `../scrappers/${league}/${club}/${club}.js`;
    console.log('Importing scrapper from:', scrapperPath);
    const scrapperModule = await import(`${scrapperPath}`);
    const scrapper = scrapperModule.default;
    console.log('Running scrapper for:', scrapper);
    const data = await scrapper();
    // Insert products into the Product table
    // Find the clubId for the given club name (case-insensitive)
    const clubRecord = await prisma.club.findFirst({
      where: { name: { equals: club, mode: 'insensitive' } },
    });
    if (!clubRecord) {
      return NextResponse.json({ error: 'Club not found in DB' }, { status: 404 });
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

    return NextResponse.json({ products: data });
  } catch (e) {
    return NextResponse.json({ error: 'Scrapper not found or failed', details: e.message }, { status: 500 });
  }
}
