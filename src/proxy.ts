
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key-change-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Define guarded routes
    const isExamRoute = path.startsWith('/exam');
    const isHandlerRoute = path.startsWith('/handler') && !path.startsWith('/handler/login');
    const isAdminRoute = path.startsWith('/admin');

    // 2. Getting the session token
    const session = request.cookies.get('session')?.value;

    // 3. Validation Logic
    if (isExamRoute || isHandlerRoute || isAdminRoute) {
        if (!session) {
            return NextResponse.redirect(new URL(isHandlerRoute || isAdminRoute ? '/handler/login' : '/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(session, key);

            // Role Check
            if (isExamRoute && payload.role !== 'CANDIDATE') {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            if ((isHandlerRoute || isAdminRoute) && payload.role !== 'HANDLER') {
                return NextResponse.redirect(new URL('/handler/login', request.url));
            }

        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL(isHandlerRoute || isAdminRoute ? '/handler/login' : '/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/exam/:path*', '/handler/:path*', '/admin/:path*'],
};
