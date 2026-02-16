import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
    console.error("Please provide an email address.");
    process.exit(1);
}

async function promoteUser() {
    console.log(`Promoting ${email} to admin...`);

    // Check if user exists
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error("User not found!");
        process.exit(1);
    }

    await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.email, email));

    console.log(`🎉 Success! ${email} is now an Admin.`);
    process.exit(0);
}

promoteUser().catch(console.error);
