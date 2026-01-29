
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with secure credentials (CJS)...');

    const passwordHash = await bcrypt.hash('password123', 10);

    // Users
    const users = [
        { u: 'staff_user', r: 'HANDLER', f: 'Management Staff' },
        { u: 'candidate_01', r: 'CANDIDATE', f: 'Student One' },
        { u: 'candidate_02', r: 'CANDIDATE', f: 'Student Two' },
        { u: 'candidate_03', r: 'CANDIDATE', f: 'Student Three' },
        { u: 'candidate_04', r: 'CANDIDATE', f: 'Student Four' },
        { u: 'candidate_05', r: 'CANDIDATE', f: 'Student Five' },
    ];
    for (const item of users) {
        await prisma.user.upsert({
            where: { username: item.u },
            update: { password: passwordHash, role: item.r },
            create: {
                username: item.u,
                password: passwordHash,
                role: item.r,
                fullName: item.f
            }
        });
        console.log(`Updated user: ${item.u}`);
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
