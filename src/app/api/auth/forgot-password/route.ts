import { passwordResetService } from "@/modules/auth/password-reset.service";
import { sendPasswordResetEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { success, remaining } = await rateLimit(`forgot-password:${ip}`);

        if (!success) {
            return NextResponse.json(
                { message: "Too many requests. Please try again later." },
                { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } }
            );
        }

        // 2. Validate Input
        const body = await req.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // 3. Generate Token (or simulate)
        // passwordResetService.generateToken returns null if user not found, 
        // effectively protecting against enumeration (if we handle timing).
        const start = Date.now();
        const token = await passwordResetService.generateToken(email);
        const duration = Date.now() - start;

        // 4. Send Email
        if (token) {
            // Fetch user name if possible, or just send generic
            // Service only returns token. Let's assume we want to send generic "Hello there" 
            // or we could update service to return user details.
            // For now, let's keep it simple.
            await sendPasswordResetEmail(email, token);
        } else {
            // 5. Simulate timing for User Not Found
            // A DB lookup takes time. If we didn't find one, we should ideally wait 
            // similar amount of time to sending email? 
            // Sending email takes a while (network). 
            // DB lookup is fast. 
            // Enumeration is mostly about "Does this email exist?".
            // If generateToken returns null quickly, attacker knows user doesn't exist.
            // If it takes longer (email sending), they know it exists.
            // To really mitigate, we should send email background or sleep here.
            const minDelay = 200; // ms
            const randomDelay = Math.floor(Math.random() * 200) + 100;
            if (duration < minDelay) {
                await new Promise(resolve => setTimeout(resolve, minDelay - duration + randomDelay));
            }
        }

        // 6. Always return 200 OK
        return NextResponse.json(
            { message: "If your email exists in our system, we have sent you a password reset link." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
