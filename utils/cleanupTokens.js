const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function wakeUpDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`; // simple ping query
    console.log('Database is awake.');
  } catch (error) {
    console.error('Error waking up database:', error);
  }
}

async function cleanupExpiredTokens() {
  try {
    await wakeUpDatabase();
    const result = await prisma.resetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    console.log(`Deleted ${result.count} expired tokens.`);
  } catch (error) {
    console.error('Error deleting expired tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupExpiredTokens();
