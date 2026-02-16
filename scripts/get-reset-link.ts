import dotenv from "dotenv";
dotenv.config();

async function getLink() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address as argument.");
        console.error("Usage: npx tsx scripts/get-reset-link.ts <email>");
        process.exit(1);
    }

    // Dynamic imports ensure these modules are loaded AFTER dotenv.config() runs
    // This is crucial because src/db/index.ts reads process.env.DATABASE_URL immediately upon import
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const { passwordResetService } = await import("@/modules/auth/password-reset.service");

    console.log(`Generating reset link for: ${email}`);

    // 1. Check if user exists
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
        console.error("User not found!");
        process.exit(1);
    }

    // 2. Generate Token
    const rawToken = await passwordResetService.generateToken(email);

    if (!rawToken) {
        console.error("Failed to generate token.");
        process.exit(1);
    }

    // 3. Construct Link
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${domain}/auth/reset-password?token=${rawToken}`;

    console.log("\n========================================");
    console.log("🔗 PASSWORD RESET LINK:");
    console.log(link);
    console.log("========================================\n");

    process.exit(0);
}

getLink().catch(console.error);
