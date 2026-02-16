import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InviteService } from "@/modules/workspace/invite.service";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { z } from "zod";

const inviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(['admin', 'member']),
});

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        const body = await req.json();
        const result = inviteSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

        const { email, role } = result.data;

        // Send Invite
        // InviteService handles permissions and duplicate checks
        await InviteService.sendInvite(user.id, workspace.id, email, role);

        return NextResponse.json({ success: true, message: "Invitation sent" });

    } catch (error: any) {
        // Return specific errors for better UX
        if (error.message.includes("Only Owners")) return NextResponse.json({ message: error.message }, { status: 403 });
        if (error.message.includes("User is already a member")) return NextResponse.json({ message: error.message }, { status: 409 });

        console.error("Invite Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        const invites = await InviteService.getWorkspaceInvites(workspace.id);
        return NextResponse.json({ invites });
    } catch (error) {
        console.error("Get Invites Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
