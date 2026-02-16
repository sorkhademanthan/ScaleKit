import { authService } from "@/lib/auth-singleton";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
    bio: z.string().max(160, "Bio must be under 160 characters").optional().nullable(),
});

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return new Response("Unauthorized", { status: 401 });

        const sessionUser = await authService.validateSession(token);
        if (!sessionUser) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten() }, { status: 400 });
        }

        const { name, bio } = result.data;

        await db.update(users)
            .set({
                name: name || sessionUser.name, // Keep existing if undefined, but schema allows partial updates
                bio: bio,
                updatedAt: new Date(),
            })
            .where(eq(users.id, sessionUser.id));

        return NextResponse.json({ success: true, user: { ...sessionUser, name, bio } });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
