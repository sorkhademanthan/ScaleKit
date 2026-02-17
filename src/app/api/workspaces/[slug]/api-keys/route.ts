
import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { ApiKeyService } from "@/modules/api-key/api-key.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        // Authorization: Only Owners/Admins
        const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
        if (!role || (role !== 'owner' && role !== 'admin')) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const body = await req.json();
        const { name } = body;
        if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

        const apiKey = await ApiKeyService.createKey(workspace.id, user.id, name);

        // Return full key ONE TIME
        return NextResponse.json({ apiKey });
    } catch (error) {
        console.error("Create API Key Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        // Authorization: Member or above? Maybe restrict to admins to see keys?
        // Let's allow members to see list but only admins create/revoke?
        // Or restrict read to admins/owners too. Safer.
        const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
        if (!role || (role !== 'owner' && role !== 'admin')) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const keys = await ApiKeyService.listKeys(workspace.id);
        return NextResponse.json({ keys });

    } catch (error) {
        console.error("List API Keys Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
        if (!workspace) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });

        const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
        if (!role || (role !== 'owner' && role !== 'admin')) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const keyId = searchParams.get('id');

        if (!keyId) return NextResponse.json({ message: "ID is required" }, { status: 400 });

        await ApiKeyService.revokeKey(workspace.id, user.id, keyId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Revoke API Key Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
