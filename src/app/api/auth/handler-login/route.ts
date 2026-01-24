
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

        if (!user || user.role !== 'HANDLER') {
            return NextResponse.json({ error: 'Invalid handler credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid handler credentials' }, { status: 401 });
        }

        // Create secure session
        await createSession({
            id: user.id,
            username: user.username,
            role: user.role
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username, fullName: user.fullName }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
