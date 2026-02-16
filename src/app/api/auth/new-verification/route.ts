import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { getVerificationTokenByToken } from "@/lib/tokens";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ message: "Missing token" }, { status: 400 });
        }

        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json({ message: "Token does not exist!" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return NextResponse.json({ message: "Token has expired!" }, { status: 400 });
        }

        // Verify user email
        const user = await db.query.users.findFirst({
            where: eq(users.email, existingToken.identifier),
        });

        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 400 });
        }

        await db.update(users)
            .set({
                emailVerified: new Date(),
                email: existingToken.identifier // In case user changed email (future proofing)
            })
            .where(eq(users.id, user.id));

        // Delete the verification token after use
        await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

        return NextResponse.json({ success: "Email verified!" });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
