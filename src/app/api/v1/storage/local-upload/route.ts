import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const key = searchParams.get("key");

        if (!key) {
            return new Response("Missing Key", { status: 400 });
        }

        // Validate Key Path (Security: No .. traversal)
        if (key.includes("..")) {
            return new Response("Invalid Key", { status: 400 });
        }

        // Only allow uploads to public/avatars/
        if (!key.startsWith("avatars/")) {
            return new Response("Invalid Key Scope", { status: 403 });
        }

        // Read the file body
        // In Next.js App Router, request body is a stream? Or Buffer?
        // Let's use arrayBuffer()
        const buffer = Buffer.from(await req.arrayBuffer());

        // File Path: ./public/${key}
        const filePath = path.join(process.cwd(), "public", key);
        const dirPath = path.dirname(filePath);

        // Ensure directory exists
        await mkdir(dirPath, { recursive: true });

        // Write File
        await writeFile(filePath, buffer);

        console.log(`[Storage/Local] Saved file to ${filePath}`);

        return NextResponse.json({ success: true, path: key });

    } catch (error) {
        console.error("Local Upload Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
