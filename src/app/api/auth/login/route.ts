import { NextResponse } from 'next/server';
import { authService, AuthError } from '@/lib/auth-singleton';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const result = await authService.login(email, password);

        const response = NextResponse.json(result, { status: 200 });
        response.cookies.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return response;

    } catch (error: any) {
        if (error.code === 'INVALID_CREDENTIALS') { // Assuming AuthError has code
            return NextResponse.json({ message: error.message }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
