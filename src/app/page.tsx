import React from 'react';
import { prisma } from '@/lib/prisma';
import HomeClient from './HomeClient';
import { CakeProduct } from '@/components/catalog/CakeCard';

// Opt in to dynamic rendering so it fetches from DB on each request
export const dynamic = 'force-dynamic';

/**
 * Landing Page Server Component.
 * Fetches all products from the database, groups them by flavour,
 * filters the top 3 signature flavours (Chocolate Fudge, Red Velvet, Pineapple),
 * and passes them to the interactive HomeClient component.
 */
export default async function Home() {
  // Fetch all available products
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: 'asc' },
  });

  // Group database products by flavour to form the CakeProduct objects
  const flavourMap: { [key: string]: CakeProduct } = {};

  products.forEach((product) => {
    const flavourName = product.flavour;
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(product.tags);
    } catch {
      parsedTags = [];
    }

    if (!flavourMap[flavourName]) {
      flavourMap[flavourName] = {
        flavour: flavourName,
        description: product.description,
        imagePath: product.imagePath,
        tags: parsedTags,
        variants: [],
      };
    }

    flavourMap[flavourName].variants.push({
      id: product.id,
      name: product.name,
      size: product.size as 'HALF_KG' | 'ONE_KG',
      price: product.price,
    });
  });

  const allFlavours = Object.values(flavourMap);

  // Take the 3 signature collections for the homepage: Chocolate Fudge, Red Velvet, Pineapple
  const featuredFlavours = ['Chocolate Fudge', 'Red Velvet', 'Pineapple'];
  const featuredCakes = allFlavours.filter((cake) =>
    featuredFlavours.includes(cake.flavour)
  );

  // Fallback in case of mismatch, take first 3 available
  const finalFeatured = featuredCakes.length === 3 ? featuredCakes : allFlavours.slice(0, 3);

  return <HomeClient featuredCakes={finalFeatured} />;
}
