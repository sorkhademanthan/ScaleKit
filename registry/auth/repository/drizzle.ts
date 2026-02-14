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
            name: inputUser.name,
            image: inputUser.image,
            githubId: inputUser.githubId,
            createdAt: inputUser.createdAt,
            updatedAt: inputUser.updatedAt
        }).returning();

        return result[0] as unknown as User;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const result = await db.update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();

        return result[0] as unknown as User;
    }

    // Helper for OAuth: Find by GitHub ID
    async findByGithubId(githubId: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.githubId, githubId)).limit(1);
        if (result.length === 0) return null;
        return result[0] as unknown as User;
    }
}
