import { authService } from "@/lib/auth-singleton";
import { storageService } from "@/modules/storage/storage.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input Validation Schema - kept for basic checks but mostly relies on Cloudinary for actual file checks during upload
const uploadSchema = z.object({
    fileType: z.string().regex(/^image\/(png|jpeg|webp)$/, "Invalid file type. Only PNG, JPEG, and WebP are allowed."),
    fileSize: z.number().max(5 * 1024 * 1024, "File size must be under 5MB."),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }

        const user = await authService.validateSession(token);
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 2. Validate Input
        const body = await req.json();
        const result = uploadSchema.safeParse(body);

        if (!result.success) {
            return new Response(JSON.stringify({ message: "Invalid input", errors: result.error.flatten() }), { status: 400 });
        }

        // 3. Generate Cloudinary Signature
        // Instead of a presigned URL, we return: signature, timestamp, apiKey, cloudName, folder
        const signData = await storageService.getUploadSignature(user.id);

        // 4. Return Signature to client
        return NextResponse.json(signData);

    } catch (error) {
        console.error("Upload Signature Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
