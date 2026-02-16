import { passwordResetService } from "@/modules/auth/password-reset.service";
import { hashPassword } from "@registry/auth/utils/password";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
    try {
        // 1. Validate Input
        const body = await req.json();
        const result = resetPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.flatten() },
                { status: 400 }
            );
        }

        const { token, password } = result.data;

        // 2. Validate Token
        const userId = await passwordResetService.validateToken(token);

        if (!userId) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // 3. Hash New Password
        const passwordHash = await hashPassword(password);

        // 4. Update User Password
        await db.update(users)
            .set({
                passwordHash: passwordHash,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        // 5. Revoke Token
        await passwordResetService.revokeRawToken(token);

        // Optional: Revoke all other sessions? The prompt suggested it.
        // We lack a sessions table right now (JWT is stateless usually or stored elsewhere).
        // Since we verify token against DB secret (we don't persist sessions), 
        // existing JWTs remain valid until expiry unless we implement a blacklist or token versioning.
        // For now, updating password prevents *new* logins with old pass.
        // To strictly logout everywhere, we'd need to track token versions (e.g. `tokenVersion` in user, and user in JWT).
        // That's advanced scope creep. Let's stick to prompt requirements.

        return NextResponse.json(
            { success: true, message: "Password has been reset successfully." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
