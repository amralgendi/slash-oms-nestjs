import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Started!');
  for (let i = 0; i < 200; i++) {
    console.log('Start:', i);
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ dec: 2 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        weight: parseFloat(
          faker.number.float({ min: 0.1, max: 10 }).toFixed(2),
        ),
      },
    });
    console.log('End:', i);
  }

  console.log('Seed data created successfully.');
}

main();
