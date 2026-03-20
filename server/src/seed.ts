import prisma from './config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const charities = [
    {
      name: "Golf for Good",
      description: "Supporting youth golf programs in underprivileged communities.",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Green Fairways Charity",
      description: "Environmental conservation focusing on golf course sustainability.",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Caddy Care",
      description: "Providing healthcare and education for local caddies and their families.",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    }
  ];

  console.log('🌱 Starting seed...');

  // Optional: Clear existing charities if you want a fresh start every time
  // await prisma.charity.deleteMany();

  for (const charity of charities) {
    const existing = await prisma.charity.findFirst({
      where: { name: charity.name }
    });

    if (!existing) {
      await prisma.charity.create({
        data: charity,
      });
      console.log(`Created charity: ${charity.name}`);
    }
  }

  // Create Default Admin
  const adminEmail = "admin@golfgiver.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Headquarters Admin",
        role: "ADMIN",
        isVerified: true,
        subscriptionStatus: "ACTIVE",
      }
    });
    console.log(`✅ Default admin created: ${adminEmail} (auth: admin123)`);
  } else {
    console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
