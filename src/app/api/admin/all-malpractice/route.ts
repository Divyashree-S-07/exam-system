
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET() {
    const sessionData = await verifySession();
    if (!sessionData || sessionData.role !== 'HANDLER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.malpracticeLog.findMany({
        include: {
            session: {
                include: {
                    user: {
                        select: {
                            username: true,
                            fullName: true
                        }
                    }
                }
            }
        },
        orderBy: {
            timestamp: 'desc'
        }
    });

    return NextResponse.json({ logs });
}
