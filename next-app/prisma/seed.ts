import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: 'header_title' },
    update: {},
    create: {
      key: 'header_title',
      value: 'Christmas Wishlist 2026',
    },
  });

  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.createMany({
      data: [
        { fullName: 'Alex Doe', category: 'ADULT' },
        { fullName: 'Sam Smith', category: 'ADULT' },
        { fullName: 'Charlie', category: 'KID' },
        { fullName: 'Buddy', category: 'PET' },
      ],
    });
    console.log('Seeded initial users.');
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
