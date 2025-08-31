import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@janseva.com' },
    update: {},
    create: {
      email: 'admin@janseva.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91-9876543210'
    },
  });

  // Create department user
  const deptPassword = await bcrypt.hash('dept123', 10);
  const department = await prisma.user.upsert({
    where: { email: 'roads@janseva.com' },
    update: {},
    create: {
      email: 'roads@janseva.com',
      name: 'Roads Department',
      password: deptPassword,
      role: 'DEPARTMENT',
      phone: '+91-9876543211'
    },
  });

  // Create citizen user
  const citizenPassword = await bcrypt.hash('citizen123', 10);
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@janseva.com' },
    update: {},
    create: {
      email: 'citizen@janseva.com',
      name: 'Test Citizen',
      password: citizenPassword,
      role: 'CITIZEN',
      phone: '+91-9876543212'
    },
  });

  // Create sample issues
  const issue1 = await prisma.issue.create({
    data: {
      title: 'Pothole on Main Road',
      description: 'Large pothole on the main road near the market area causing traffic issues.',
      category: 'ROAD',
      status: 'SUBMITTED',
      priority: 'HIGH',
      location: 'Main Road, Market Area, Ranchi',
      coordinates: JSON.stringify({ lat: 23.3441, lng: 85.3096 }),
      images: JSON.stringify(['https://example.com/pothole1.jpg']),
      reporterId: citizen.id
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: 'Broken Street Light',
      description: 'Street light not working for the past 3 days in residential area.',
      category: 'STREETLIGHT',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      location: 'Residential Colony, Ranchi',
      coordinates: JSON.stringify({ lat: 23.3441, lng: 85.3096 }),
      images: JSON.stringify(['https://example.com/streetlight1.jpg']),
      reporterId: citizen.id,
      assigneeId: department.id,
      department: 'Electrical Department'
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: 'Water Pipeline Leak',
      description: 'Water leaking from underground pipeline near the park.',
      category: 'WATER',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      location: 'City Park, Ranchi',
      coordinates: JSON.stringify({ lat: 23.3441, lng: 85.3096 }),
      images: JSON.stringify(['https://example.com/waterleak1.jpg']),
      reporterId: citizen.id,
      assigneeId: department.id,
      department: 'Water Department'
    },
  });

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: 'Issue has been acknowledged and will be addressed within 24 hours.',
      issueId: issue1.id,
      userId: admin.id
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Work crew has been dispatched to fix the street light.',
      issueId: issue2.id,
      userId: department.id
    },
  });

  // Create sample notifications
  await prisma.notification.create({
    data: {
      title: 'Issue Acknowledged',
      message: 'Your issue "Pothole on Main Road" has been acknowledged.',
      type: 'ISSUE_UPDATE',
      userId: citizen.id
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Issue Assigned',
      message: 'Issue "Broken Street Light" has been assigned to Electrical Department.',
      type: 'ASSIGNMENT',
      userId: citizen.id
    },
  });

  // Create issue updates
  await prisma.issueUpdate.create({
    data: {
      status: 'ACKNOWLEDGED',
      message: 'Issue has been acknowledged and is under review.',
      issueId: issue1.id
    },
  });

  await prisma.issueUpdate.create({
    data: {
      status: 'ASSIGNED',
      message: 'Issue has been assigned to Electrical Department.',
      issueId: issue2.id
    },
  });

  await prisma.issueUpdate.create({
    data: {
      status: 'IN_PROGRESS',
      message: 'Work has started on fixing the water pipeline.',
      issueId: issue3.id
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('   Admin: admin@janseva.com / admin123');
  console.log('   Department: roads@janseva.com / dept123');
  console.log('   Citizen: citizen@janseva.com / citizen123');
  console.log('');
  console.log('🔗 Database: SQLite file created at ./dev.db');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
