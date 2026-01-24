
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
        const { violationType, details } = body;

        const session = await prisma.examSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Session invalid' }, { status: 403 });
        }

        // Log the malpractice
        await prisma.malpracticeLog.create({
            data: {
                sessionId,
                violationType,
                details
            }
        });

        // IMMEDIATE TERMINATION
        await prisma.examSession.update({
            where: { id: sessionId },
            data: {
                status: 'TERMINATED',
                endTime: new Date()
            }
        });

        return NextResponse.json({ success: true, terminated: true });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
