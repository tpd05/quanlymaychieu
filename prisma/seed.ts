import { PrismaClient, Role, ProjectorStatus } from '@prisma/client';
import { hashPassword } from '@/lib/bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword('admin123');
  await prisma.user.upsert({
    where: { userID: 'admin' },
    update: {},
    create: {
      userID: 'admin',
      fullName: 'Quản trị viên',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.admin,
      isActive: true,
    },
  });

  await prisma.projector.createMany({
    data: [
      { 
        name: 'Epson X100', 
        model: 'X100', 
        serialNumber: 'SN-001', 
        room: 'Phòng 101',
        building: 'Tòa A', 
        status: ProjectorStatus.available,
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        timeUsed: 150,
      },
      { 
        name: 'Sony VPL', 
        model: 'VPL-EX', 
        serialNumber: 'SN-002', 
        room: 'Phòng 102',
        building: 'Tòa A',
        status: ProjectorStatus.maintenance,
        purchaseDate: new Date('2023-03-20'),
        warrantyExpiry: new Date('2026-03-20'),
        timeUsed: 200,
      },
      { 
        name: 'BenQ MH535', 
        model: 'MH535', 
        serialNumber: 'SN-003', 
        room: 'Phòng 201',
        building: 'Tòa B',
        status: ProjectorStatus.available,
        purchaseDate: new Date('2023-06-10'),
        warrantyExpiry: new Date('2026-06-10'),
        timeUsed: 80,
      },
      { 
        name: 'ViewSonic PA503S', 
        model: 'PA503S', 
        serialNumber: 'SN-004', 
        room: 'Phòng 202',
        building: 'Tòa B',
        status: ProjectorStatus.available,
        purchaseDate: new Date('2023-09-05'),
        warrantyExpiry: new Date('2026-09-05'),
        timeUsed: 50,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
