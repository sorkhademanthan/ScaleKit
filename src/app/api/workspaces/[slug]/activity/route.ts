
import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { ActivityService } from "@/modules/activity/activity.service";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> } // Next 15: params is a promise
) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Get Workspace ID
        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        // Check Membership
        const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
        if (!role) return NextResponse.json({ message: "Access denied" }, { status: 403 });

        // Fetch Activities
        const activities = await ActivityService.getWorkspaceActivity(workspace.id, 50); // Fetch last 50

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("Fetch Activity Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
