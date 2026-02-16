import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

export const passwordResetService = {
    /**
     * Generates a password reset token, hashes it, stores the hash,
     * and returns the raw token to be sent via email.
     */
    async generateToken(email: string): Promise<string | null> {
        // 1. Verify user exists
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // Return null silently to prevent enumeration (or handle in controller)
            // The prompt says: "If NOT found: Do nothing, but wait a random time".
            // But here we are just generating token. The controller calls this.
            // If user not found, we can't link a token. So return null.
            return null;
        }

        // 2. Generate secure random token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // 3. Hash the token for storage
        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        // 4. Set expiration (1 hour)
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        // 5. Store hash in DB
        // We invalidate any existing tokens for this user?
        // The prompt says "create a table password_reset_tokens...".
        // Usually good practice to revoke old ones, but prompt didn't strictly say so.
        // Let's just insert a new one. The schema allows multiple tokens per user technically (id is PK).
        // However, clean up is nice. Let's stick to prompt: "Store { userId, tokenHash, expiresAt }".

        await db.insert(passwordResetTokens).values({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        return rawToken;
    },

    /**
     * Validates a raw token by hashing it and checking the DB.
     * Returns userId if valid, null otherwise.
     */
    async validateToken(rawToken: string): Promise<string | null> {
        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        const record = await db.query.passwordResetTokens.findFirst({
            where: and(
                eq(passwordResetTokens.tokenHash, tokenHash),
                gt(passwordResetTokens.expiresAt, new Date())
            ),
        });

        if (!record) {
            return null;
        }

        return record.userId;
    },

    /**
     * Revokes a token by deleting it from the DB.
     */
    async revokeToken(tokenHash: string): Promise<void> {
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.tokenHash, tokenHash));
    },

    /**
     * Helper to revoke by raw token if needed (convenience)
     */
    async revokeRawToken(rawToken: string): Promise<void> {
        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        await this.revokeToken(tokenHash);
    }
};
