
import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { ActivityService } from "@/modules/activity/activity.service";
import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function ActivityPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");
    const user = await authService.validateSession(token);
    if (!user) redirect("/login");

    const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
    if (!workspace) return notFound();

    // Check Membership
    const role = await WorkspaceService.getMemberRole(user.id, workspace.id);
    if (!role) return notFound();

    // Fetch Limit
    const activities = await ActivityService.getWorkspaceActivity(workspace.id, 50);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
                    <p className="text-muted-foreground">View recent actions in {workspace.name}.</p>
                </div>
            </div>

            {activities.length === 0 ? (
                <div className="rounded-md border bg-card p-12 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                    <div className="rounded-full bg-muted p-4">
                        <Activity className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No recent activity</h3>
                    <p>Activity logs will appear here when members perform actions.</p>
                </div>
            ) : (
                <div className="relative border-l border-muted ml-4 space-y-8">
                    {activities.map((log) => (
                        <div key={log.id} className="relative pl-8">
                            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                            <div className="flex flex-col gap-1">
                                <div className="text-sm">
                                    <span className="font-semibold text-foreground">{log.actor.name || log.actor.email}</span>
                                    {" "}
                                    <span className="text-muted-foreground">
                                        {formatAction(log.action, log.metadata)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function formatAction(action: string, metadata: any): string {
    switch (action) {
        case 'workspace.created':
            return 'created this workspace';
        case 'member.invited':
            return `invited ${metadata?.email || 'a user'}`;
        case 'member.joined':
            return 'joined the team';
        case 'invite.revoked':
            return `revoked invite for ${metadata?.email || 'a user'}`;
        default:
            return action;
    }
}
