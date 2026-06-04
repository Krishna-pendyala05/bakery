import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 9 Indian bakery cake flavours, each available in two sizes.
 * Total: 18 Product rows (9 flavours x 2 sizes).
 * Prices are in INR. Placeholder names — update with real bakery flavours before go-live.
 */
const FLAVOURS = [
  {
    flavour: 'Chocolate Fudge',
    description: 'Layers of moist chocolate sponge filled and frosted with a rich, dark chocolate fudge ganache. A classic favourite for chocolate lovers.',
    imagePath: '/images/cake-image1.png',
    tags: JSON.stringify([]),
    halfKgPrice: 450,
    oneKgPrice: 850,
  },
  {
    flavour: 'Red Velvet',
    description: 'Deep crimson velvet sponge with a subtle cocoa note, generously frosted with silky vanilla cream cheese. Available with an eggless option.',
    imagePath: '/images/cake-image2.png',
    tags: JSON.stringify(['eggless available']),
    halfKgPrice: 500,
    oneKgPrice: 950,
  },
  {
    flavour: 'Pineapple',
    description: 'Light and airy vanilla sponge layered with fresh pineapple slices, whipped cream, and a hint of pineapple syrup. A timeless crowd-pleaser.',
    imagePath: '/images/cake-image1.png',
    tags: JSON.stringify(['eggless']),
    halfKgPrice: 380,
    oneKgPrice: 720,
  },
  {
    flavour: 'Butterscotch',
    description: 'Soft sponge layered with butterscotch custard cream and topped with crunchy butterscotch praline pieces and a smooth butterscotch drizzle.',
    imagePath: '/images/cake-image2.png',
    tags: JSON.stringify([]),
    halfKgPrice: 400,
    oneKgPrice: 750,
  },
  {
    flavour: 'Alphonso Mango',
    description: 'Seasonal specialty: light sponge layers filled with fresh Alphonso mango pulp mousse and topped with mango glaze. Available in summer season only.',
    imagePath: '/images/cake-image2.png',
    tags: JSON.stringify(['seasonal', 'eggless']),
    halfKgPrice: 480,
    oneKgPrice: 900,
  },
  {
    flavour: 'Black Forest',
    description: 'Classic German-inspired cake: chocolate sponge soaked in cherry syrup, layered with whipped cream and cherries, finished with chocolate shavings.',
    imagePath: '/images/cake-image1.png',
    tags: JSON.stringify([]),
    halfKgPrice: 420,
    oneKgPrice: 800,
  },
  {
    flavour: 'Blueberry',
    description: 'Vanilla sponge layered with fresh blueberry compote and smooth cream cheese frosting, topped with a fresh blueberry and white chocolate garnish.',
    imagePath: '/images/cake-image2.png',
    tags: JSON.stringify(['eggless available']),
    halfKgPrice: 520,
    oneKgPrice: 980,
  },
  {
    flavour: 'Strawberry',
    description: 'Fluffy vanilla sponge filled with fresh strawberry preserve and light whipped cream, decorated with whole fresh strawberries on top.',
    imagePath: '/images/cake-image1.png',
    tags: JSON.stringify(['eggless']),
    halfKgPrice: 450,
    oneKgPrice: 850,
  },
  {
    flavour: 'Vanilla Bean',
    description: 'A pure, elegant classic. Moist vanilla bean sponge with Madagascar vanilla buttercream, simple and perfect for any occasion.',
    imagePath: '/images/cake-image2.png',
    tags: JSON.stringify(['eggless available']),
    halfKgPrice: 350,
    oneKgPrice: 680,
  },
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing products before seeding to keep the data clean
  await prisma.product.deleteMany({});
  console.log('Cleared existing products.');

  let totalCreated = 0;

  for (const flavour of FLAVOURS) {
    // Create the HALF_KG variant
    await prisma.product.create({
      data: {
        name: `${flavour.flavour} Cake - Half Kg`,
        flavour: flavour.flavour,
        size: 'HALF_KG',
        description: flavour.description,
        price: flavour.halfKgPrice,
        imagePath: flavour.imagePath,
        tags: flavour.tags,
        isAvailable: true,
      },
    });
    totalCreated++;

    // Create the ONE_KG variant
    await prisma.product.create({
      data: {
        name: `${flavour.flavour} Cake - 1 Kg`,
        flavour: flavour.flavour,
        size: 'ONE_KG',
        description: flavour.description,
        price: flavour.oneKgPrice,
        imagePath: flavour.imagePath,
        tags: flavour.tags,
        isAvailable: true,
      },
    });
    totalCreated++;

    console.log(`  Seeded: ${flavour.flavour} (Half Kg: Rs.${flavour.halfKgPrice} | 1 Kg: Rs.${flavour.oneKgPrice})`);
  }

  console.log(`\nSeeding complete. Created ${totalCreated} products (${FLAVOURS.length} flavours x 2 sizes).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
