import React from 'react';
import { prisma } from '@/lib/prisma';
import CakesPageClient from './CakesPageClient';
import { CakeProduct } from '@/components/catalog/CakeCard';

// Force dynamic fetch from SQLite to keep database data fresh
export const dynamic = 'force-dynamic';

/**
 * Cakes Catalog Server Component.
 * Fetches all available products from the database, groups them by flavour
 * (creating size-specific variant records), and passes them to the interactive
 * Client Component for searching, filtering, and modal display.
 */
export default async function CakesPage() {
  // Fetch available products from DB
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: 'asc' },
  });

  // Group size variants under their flavour name
  const flavourMap: { [key: string]: CakeProduct } = {};
  const tagsSet = new Set<string>();

  products.forEach((product) => {
    const flavourName = product.flavour;
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(product.tags);
    } catch {
      parsedTags = [];
    }

    // Add tags to the global set of filter tags
    parsedTags.forEach((t) => tagsSet.add(t));

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

  const cakes = Object.values(flavourMap);
  const availableTags = Array.from(tagsSet);

  return <CakesPageClient cakes={cakes} availableTags={availableTags} />;
}
