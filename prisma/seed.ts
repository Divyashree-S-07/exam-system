
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database with secure credentials...')

    const passwordHash = await hashPassword('password123');

    // Create Users
    const handler = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: passwordHash },
        create: {
            username: 'admin',
            password: passwordHash,
            role: 'HANDLER',
            fullName: 'Exam Controller',
        },
    })

    // Candidate 1
    const candidate = await prisma.user.upsert({
        where: { username: 'candidate1' },
        update: { password: passwordHash },
        create: {
            username: 'candidate1',
            password: passwordHash,
            role: 'CANDIDATE',
            fullName: 'John Doe',
        },
    })

    // Candidate 2
    await prisma.user.upsert({
        where: { username: 'candidate2' },
        update: { password: passwordHash },
        create: {
            username: 'candidate2',
            password: passwordHash,
            role: 'CANDIDATE',
            fullName: 'Jane Smith',
        },
    })

    // Create Exam if not exists
    const examCount = await prisma.exam.count();
    let exam;

    if (examCount === 0) {
        exam = await prisma.exam.create({
            data: {
                title: 'General Knowledge Exam',
                durationMin: 60,
            }
        })

        // Create 50 Questions
        console.log('Creating questions...')
        const questionsData = []
        for (let i = 1; i <= 50; i++) {
            questionsData.push({
                text: `Question ${i}: What is the capital of Region ${i}?`,
                options: JSON.stringify(["City A", "City B", "City C", "City D"]),
                correct: "A",
                examId: exam.id
            })
        }

        for (const q of questionsData) {
            await prisma.question.create({ data: q })
        }
    }

    console.log({ handler, candidate })
    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
