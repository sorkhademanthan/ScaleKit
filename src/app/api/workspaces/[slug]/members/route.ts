import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WorkspaceService } from "@/modules/workspace/workspace.service";

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

        // Permissions: Members can list other members. So any valid member can call this.
        const currentUserRole = await WorkspaceService.getMemberRole(user.id, workspace.id);
        if (!currentUserRole) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const members = await WorkspaceService.getMembers(workspace.id);
        return NextResponse.json({ members });

    } catch (error) {
        console.error("Get Members Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
