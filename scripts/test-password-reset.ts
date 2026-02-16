
// How to Test Password Reset Flow

// 1. Request Reset
// Go to: http://localhost:3000/forgot-password
// Enter your email (e.g., test@example.com).
// Click "Send Login Link".
// Expected: Success message "Check your email".

// 2. Check Database (Verify Hashing)
// Run this SQL or use a DB viewer:
// SELECT * FROM password_reset_tokens WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com');
// Expected: You should see a record. The `token_hash` will look like a long random string (e.g., a665a4...).
// Note: You will NOT find the raw token here. The raw token was only in memory/email.

// 3. Get the Token (Simulate Email)
// Since we might not have real email sending set up (unless Resend API key is valid), 
// check your terminal console logs! 
// We added logic to log the link if API key is missing.
// Look for: "Logging reset link: http://localhost:3000/auth/reset-password?token=..."

// 4. Reset Password
// Copy the full link from the terminal.
// Paste into browser.
// Enter new password (must be strong: 8 chars, 1 uppercase, 1 number).
// Click "Reset Password".
// Expected: "Password reset successful" or redirect to login.

// 5. Try Logging In
// Go to /login.
// Use the NEW password.
// Expected: Success! Dashboard loads.
// Try OLD password.
// Expected: Failure.

// 6. Verify Token Revocation
// Try to open the reset link again.
// Expected: "Invalid or expired token" error on the page.
// Check Database: The record in `password_reset_tokens` should be gone.

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { passwordResetService } from "@/modules/auth/password-reset.service";

async function verifyTokenHashing(email: string) {
    console.log(`Testing token hashing for ${email}...`);

    // 1. Generate Token
    const rawToken = await passwordResetService.generateToken(email);
    if (!rawToken) {
        console.error("User not found or error generating token.");
        return;
    }
    console.log("Generated Raw Token:", rawToken);

    // 2. Find in DB
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) return;

    const dbRecord = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.userId, user.id)
    });

    if (!dbRecord) {
        console.error("Token record not found in DB!");
        return;
    }

    console.log("Stored Token Hash:", dbRecord.tokenHash);

    // 3. Verify they are DIFFERENT
    if (rawToken === dbRecord.tokenHash) {
        console.error("❌ FAILURE: Raw token matches Stored Hash! (Not Secure)");
    } else {
        console.log("✅ SUCCESS: Raw token is NOT stored in DB.");
    }

    // 4. Verify Validation Logic
    const isValid = await passwordResetService.validateToken(rawToken);
    if (isValid === user.id) {
        console.log("✅ SUCCESS: validateToken() correctly identifies the user.");
    } else {
        console.error("❌ FAILURE: validateToken() failed to validate valid token.");
    }

    // Cleanup
    await passwordResetService.revokeRawToken(rawToken);
    console.log("Cleanup complete.");
}

// Runnable if called directly (e.g. ts-node)
// verifyTokenHashing("manthan_test@scalekit.com").catch(console.error);
