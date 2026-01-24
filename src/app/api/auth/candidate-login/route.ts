
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || user.role !== 'CANDIDATE') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check for existing active session
        let session = await prisma.examSession.findFirst({
            where: {
                userId: user.id,
                status: 'ACTIVE',
            },
        });

        // If no active session, create one (assuming only 1 exam exists for now)
        if (!session) {
            const exam = await prisma.exam.findFirst();
            if (!exam) return NextResponse.json({ error: 'No exam configured' }, { status: 500 });

            // Check if user already COMPLETED/TERMINATED?
            const completedSession = await prisma.examSession.findFirst({
                where: { userId: user.id, status: { in: ['COMPLETED', 'TERMINATED'] } }
            });

            if (completedSession) {
                return NextResponse.json({ error: 'Exam already taken' }, { status: 403 });
            }

            session = await prisma.examSession.create({
                data: {
                    userId: user.id,
                    examId: exam.id,
                    status: 'ACTIVE'
                }
            });
        }

        // Create Secure Session Cookie
        await createSession({
            id: user.id,
            username: user.username,
            role: user.role,
            sessionId: session.id
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username, fullName: user.fullName },
            sessionId: session.id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
