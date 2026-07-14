const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Querying users from local SQL Server...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        universityId: true,
        cnic: true,
        mobileNumber: true,
        gender: true,
        facultyId: true,
        departmentId: true,
        programId: true,
        semester: true,
        createdAt: true
      }
    });

    console.log(`Found ${users.length} users in local SQL Server:`);
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error querying local SQL Server:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
