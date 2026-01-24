
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with secure credentials (CJS)...');

    const passwordHash = await bcrypt.hash('password123', 10);

    // Users
    const users = ['admin', 'candidate1', 'candidate2'];
    for (const u of users) {
        await prisma.user.upsert({
            where: { username: u },
            update: { password: passwordHash },
            create: {
                username: u,
                password: passwordHash,
                role: u === 'admin' ? 'HANDLER' : 'CANDIDATE',
                fullName: u === 'admin' ? 'Exam Controller' : `User ${u}`
            }
        });
        console.log(`Updated user: ${u}`);
    }

    // Exam
    const exam = await prisma.exam.findFirst();
    if (!exam) {
        const newExam = await prisma.exam.create({
            data: { title: 'General Knowledge Exam', durationMin: 60 }
        });
        console.log('Created Exam');

        const questionsData = [];
        for (let i = 1; i <= 50; i++) {
            questionsData.push({
                text: `Question ${i}: What is the capital of Region ${i}?`,
                options: JSON.stringify(["City A", "City B", "City C", "City D"]),
                correct: "A",
                examId: newExam.id
            });
        }
        for (const q of questionsData) {
            await prisma.question.create({ data: q });
        }
        console.log('Created Questions');
    }

    console.log('Seeding completed.');
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
