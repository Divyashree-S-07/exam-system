
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET() {
    const sessionData = await verifySession();
    if (!sessionData || sessionData.role !== 'HANDLER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalSessions, active, completed, terminated, totalViolations] = await Promise.all([
        prisma.examSession.count(),
        prisma.examSession.count({ where: { status: 'ACTIVE' } }),
        prisma.examSession.count({ where: { status: 'COMPLETED' } }),
        prisma.examSession.count({ where: { status: 'TERMINATED' } }),
        prisma.malpracticeLog.count()
    ]);

    return NextResponse.json({
        stats: {
            totalSessions,
            active,
            completed,
            terminated,
            totalViolations
        }
    });
}
