import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog"; // Can we render client component here?
// No, we need a client wrapper for the dialog if we want to show it on load.
// Or just a button "Create Workspace".

export default async function DashboardRedirector() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");
    const user = await authService.validateSession(token);
    if (!user) redirect("/login");

    // Fetch workspaces
    const workspaces = await WorkspaceService.getUserWorkspaces(user.id);

    if (workspaces.length > 0) {
        // Redirect to the first workspace (or last active if we tracked it properly)
        // If user has lastActiveWorkspaceId, use that.
        // We added the column, but let's just use the first one for now.
        // TODO: Implement Last Active Logic
        return redirect(`/dashboard/${workspaces[0].slug}`);
    }

    // No workspaces? Show Empty State
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to ScaleKit</h1>
                <p className="text-muted-foreground">You don't belong to any workspace yet.</p>
            </div>

            {/* We need a client component to trigger the dialog or just a button that opens it. 
                Since Sidebar has the "Create Team" button in the switcher, user can't see it if they have NO workspaces?
                Actually WorkspaceSwitcher handles empty state?
                Let's check WorkspaceSwitcher. Values activeWorkspace = undefined.
                It shows "Select Team". Dropdown shows "Create Team".
            */}
            <div className="p-4 bg-muted rounded-lg border border-dashed">
                <p className="mb-4">Get started by creating a new workspace.</p>
                {/* 
                  Since we are in a Server Component, we can't use onClick.
                  We can render a client component "EmptyState" that has the dialog.
                  But for now, let's just instruct them to use the sidebar if visible, 
                  OR better, the Sidebar might NOT render correctly without workspaces.
                  The Sidebar receives `workspaces=[]`. It will render "Select Team".
                  User clicks it -> "Create Team".
                  So we just point them there.
                */}
                <p className="text-sm text-muted-foreground">
                    Use the sidebar to create your first team.
                </p>
            </div>
        </div>
    );
}
