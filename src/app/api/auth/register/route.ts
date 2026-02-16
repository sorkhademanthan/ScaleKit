import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-singleton';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // 1. Register User (DB)
        const result = await authService.register(email, password, role);

        // 2. Generate Verification Token
        const verificationToken = await generateVerificationToken(email);

        // 3. Send Verification Email
        await sendVerificationEmail(email, verificationToken.token);

        // 4. Set Session Cookie (Login immediately, but with unverified email)
        const response = NextResponse.json(result, { status: 201 });
        response.cookies.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error: any) {
        if (error.code === 'USER_EXISTS') { // Assuming AuthError has code
            return NextResponse.json({ message: error.message }, { status: 409 });
        }
        console.error("Register Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
