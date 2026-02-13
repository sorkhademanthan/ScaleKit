import { eq } from "drizzle-orm";
import { db } from "@/db"; // Assuming @/db resolves to src/db/index.ts
import { users } from "@/db/schema";
import { User, UserRepository } from "../types";

export class DrizzleUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (result.length === 0) return null;

        // Ensure manual cast compatibility or stricter typing where needed
        return result[0] as unknown as User;
    }

    async findById(id: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (result.length === 0) return null;
        return result[0] as unknown as User;
    }

    async create(inputUser: User): Promise<User> {
        // Drizzle insert returns array of inserted records.
        // We explicitly map the input to the schema fields.
        const result = await db.insert(users).values({
            id: inputUser.id,
            email: inputUser.email,
            passwordHash: inputUser.passwordHash,
            role: inputUser.role, // Assuming schema role is string or compatible
            createdAt: inputUser.createdAt,
            updatedAt: inputUser.updatedAt
        }).returning();

        return result[0] as unknown as User;
    }
}
