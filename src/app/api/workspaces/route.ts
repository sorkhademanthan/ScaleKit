import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { z } from "zod";

const createWorkspaceSchema = z.object({
    name: z.string().min(2, "Workspace name must be at least 2 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters.")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only.")
});

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // 2. Validate Input
        const body = await req.json();
        const result = createWorkspaceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, slug } = result.data;

        // 3. Create Workspace
        try {
            const workspace = await WorkspaceService.createWorkspace(user.id, name, slug);
            return NextResponse.json({ success: true, workspace });
        } catch (err: any) {
            if (err.message.includes("already exists")) {
                return NextResponse.json({ message: "Slug already exists. Please choose another." }, { status: 409 });
            }
            throw err;
        }

    } catch (error: any) {
        console.error("Create Workspace Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Fetch all workspaces for user
        const userWorkspaces = await WorkspaceService.getUserWorkspaces(user.id);

        return NextResponse.json({ workspaces: userWorkspaces });

    } catch (error) {
        console.error("Get Workspaces Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
