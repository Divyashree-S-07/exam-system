
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request) {
    const sessionData = await verifySession();
    if (!sessionData || sessionData.role !== 'CANDIDATE') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = sessionData.sessionId as string;

    const session = await prisma.examSession.findUnique({
        where: { id: sessionId },
        include: { exam: true }
    });

    if (!session || session.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 403 });
    }

    // Fetch questions
    const questions = await prisma.question.findMany({
        where: { examId: session.examId },
        select: {
            id: true,
            text: true,
            options: true,
            // Do NOT return 'correct' answer
        }
    });

    return NextResponse.json({
        questions: questions.map(q => ({
            ...q,
            options: JSON.parse(q.options)
        })),
        startTime: session.startTime,
        durationMin: session.exam.durationMin
    });
}
