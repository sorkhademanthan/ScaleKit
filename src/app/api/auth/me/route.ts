import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-singleton';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await authService.validateSession(token);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
