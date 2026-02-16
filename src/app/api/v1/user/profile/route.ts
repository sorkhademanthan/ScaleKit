import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withPermission } from "@/lib/auth-guard";
import { User } from "@registry/auth/types";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
    bio: z.string().max(160, "Bio must be under 160 characters").optional().nullable(),
});

async function handler(req: Request, user: User) {
    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ message: "Invalid input", errors: result.error.flatten() }, { status: 400 });
    }

    const { name, bio } = result.data;

    await db.update(users)
        .set({
            name: name || user.name, // Keep existing if undefined, but schema allows partial updates
            bio: bio,
            updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

    // Notice we spread the updated fields over 'user' object, 
    // but we can't be sure 'user' has all fields up to date from DB inside this handler unless we refetched.
    // However, for response, this is fine.
    return NextResponse.json({ success: true, user: { ...user, name, bio } });
}

// Protect the route with 'manage:profile' permission
export const PATCH = withPermission("manage:profile", handler);
