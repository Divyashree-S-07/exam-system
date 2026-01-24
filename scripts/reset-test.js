
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up existing sessions and logs...');
    await prisma.malpracticeLog.deleteMany({});
    await prisma.examSession.deleteMany({});
    console.log('Cleanup completed.');
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
