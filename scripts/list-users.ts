import dotenv from "dotenv";
dotenv.config();

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function listUsers() {
    console.log("Fetching users from DB...");
    const allUsers = await db.select().from(users);
    console.log("Users found:", allUsers.length);
    allUsers.forEach(u => {
        console.log(`- ${u.email} (ID: ${u.id})`);
    });
}

listUsers().catch(console.error);
