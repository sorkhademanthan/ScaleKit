import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

// Configure which paths the middleware runs on
export const config = {
    matcher: "/api/:path*",
};

export async function middleware(req: NextRequest) {
    // 1. Identify User (IP Address)
    // In production (Vercel), use correct headers.
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const path = req.nextUrl.pathname;

    // 2. Determine Rate Limit Type
    let type: 'api' | 'auth' | 'public' = 'api';

    if (path.startsWith("/api/auth")) {
        type = 'auth';
    } else if (path.startsWith("/api/public") || path.startsWith("/api/webhooks")) {
        type = 'public';
    }

    // 3. Check Limit
    try {
        const result = await checkRateLimit(ip, type);

        if (!result.success) {
            return NextResponse.json(
                { message: "Too Many Requests", retryAfter: result.reset },
                {
                    status: 429, headers: {
                        "X-RateLimit-Limit": result.limit.toString(),
                        "X-RateLimit-Remaining": result.remaining.toString(),
                        "X-RateLimit-Reset": result.reset.toString()
                    }
                }
            );
        }

        // Add headers to successful response
        const res = NextResponse.next();
        res.headers.set("X-RateLimit-Limit", result.limit.toString());
        res.headers.set("X-RateLimit-Remaining", result.remaining.toString());

        return res;

    } catch (error) {
        console.error("Middleware Rate Limit Error:", error);
        // Fail open if rate limit service crashes
        return NextResponse.next();
    }
}
