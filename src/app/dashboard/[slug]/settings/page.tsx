
import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { WorkspaceService } from "@/modules/workspace/workspace.service";

interface SettingsPageProps {
    params: {
        slug: string;
    };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");
    const user = await authService.validateSession(token);
    if (!user) redirect("/login");

    const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
    if (!workspace) return notFound();

    // Check Role - Ensure user is actually a member
    const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
    if (!role) return notFound(); // Or forbidden page

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Workspace Settings</h2>
                    <p className="text-muted-foreground">Manage your workspace configuration.</p>
                </div>
            </div>

            <div className="rounded-md border bg-card p-6 shadow-sm">
                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Workspace Name</label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={workspace.name}
                            disabled // Read only for now unless we implement update
                        />
                        <p className="text-xs text-muted-foreground">Contact support to change workspace name.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Workspace Slug</label>
                        <div className="flex items-center rounded-md border border-input bg-muted/50 px-3">
                            <span className="text-sm text-muted-foreground">scalekit.com/</span>
                            <input
                                className="flex h-10 w-full bg-transparent py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={workspace.slug}
                                disabled
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Delete Section - Only for Owners */}
            {role === 'owner' && (
                <div className="rounded-md border border-red-200 bg-red-50 p-6">
                    <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
                    <p className="text-sm text-red-700 mt-1 mb-4">
                        Deleting a workspace is irreversible and will remove all associated data.
                    </p>
                    <button className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                        Delete Workspace
                    </button>
                </div>
            )}
        </div>
    );
}
