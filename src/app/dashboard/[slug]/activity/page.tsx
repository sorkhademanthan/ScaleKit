
import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { Activity } from "lucide-react";

export default async function ActivityPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");
    const user = await authService.validateSession(token);
    if (!user) redirect("/login");

    const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
    if (!workspace) return notFound();

    // In a real app, we would fetch activity logs from DB
    // For now, let's show a placeholder or "Coming Soon"

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
                    <p className="text-muted-foreground">View recent actions in {workspace.name}.</p>
                </div>
            </div>

            <div className="rounded-md border bg-card p-12 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                <div className="rounded-full bg-muted p-4">
                    <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No recent activity</h3>
                <p>Activity logs will appear here when members perform actions.</p>
            </div>
        </div>
    );
}
