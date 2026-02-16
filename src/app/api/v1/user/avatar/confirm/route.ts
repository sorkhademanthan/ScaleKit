import { authService } from "@/lib/auth-singleton"; // Use singleton for access
// Use singleton for auth validation

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Schema
const confirmSchema = z.object({
    fileKey: z.string().min(1, "File key is required"),
    // Allow full URLs (https://...) OR relative paths (/avatars/...)
    publicUrl: z.string().refine((val) => val.startsWith("/") || z.string().url().safeParse(val).success, {
        message: "Must be a valid URL or relative path",
    }),
});

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return new Response("Unauthorized", { status: 401 });

        const sessionUser = await authService.validateSession(token);
        if (!sessionUser) return new Response("Unauthorized", { status: 401 });

        // Validate Input
        const body = await req.json();
        const result = confirmSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten() }, { status: 400 });
        }

        const { fileKey, publicUrl } = result.data;

        // Security Check: Ensure the fileKey belongs to this user?
        // fileKey format: avatars/${userId}/${uuid}
        if (!fileKey.includes(sessionUser.id)) {
            return NextResponse.json({ message: "Unauthorized file key" }, { status: 403 });
        }

        // Update User in DB
        // We can do this via Drizzle directly since AuthService might not expose generic update
        await db.update(users)
            .set({
                image: publicUrl,
                updatedAt: new Date()
            })
            .where(eq(users.id, sessionUser.id));

        return NextResponse.json({ success: true, avatarUrl: publicUrl });

    } catch (error) {
        console.error("Confirm Upload Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
