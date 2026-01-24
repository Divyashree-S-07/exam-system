
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request) {
    const sessionData = await verifySession();
    if (!sessionData || sessionData.role !== 'HANDLER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.malpracticeLog.findMany({
        orderBy: { timestamp: 'desc' },
        include: {
            session: {
                include: {
                    user: { select: { username: true, fullName: true } }
                }
            }
        },
        take: 100
    });

    return NextResponse.json({ logs });
}
