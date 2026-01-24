
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request) {
    const sessionData = await verifySession();
    if (!sessionData || sessionData.role !== 'HANDLER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.examSession.findMany({
        orderBy: { startTime: 'desc' },
        include: {
            user: { select: { username: true, fullName: true } },
            _count: { select: { malpracticeLogs: true } }
        },
        take: 100
    });

    return NextResponse.json({ sessions });
}
