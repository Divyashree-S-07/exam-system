
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const sessionData = await verifySession();
        if (!sessionData || sessionData.role !== 'CANDIDATE') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const sessionId = sessionData.sessionId as string;

        const body = await request.json();
        const { answers } = body; // answers: { [questionId]: "A" }

        const session = await prisma.examSession.findUnique({
            where: { id: sessionId },
            include: { exam: { include: { questions: true } } }
        });

        if (!session || session.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Session invalid' }, { status: 403 });
        }

        let score = 0;
        session.exam.questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                score++;
            }
        });

        await prisma.examSession.update({
            where: { id: sessionId },
            data: {
                status: 'COMPLETED',
                score: score,
                endTime: new Date()
            }
        });

        return NextResponse.json({ success: true, score });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
