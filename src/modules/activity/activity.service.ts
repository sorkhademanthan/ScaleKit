import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class ActivityService {
    /**
     * Log a new activity.
     */
    static async log(
        workspaceId: string,
        userId: string,
        action: 'workspace.created' | 'member.invited' | 'member.joined' | 'member.removed' | 'invite.revoked' | string,
        entityType: 'workspace' | 'member' | 'invite' | string,
        entityId: string,
        metadata: Record<string, any> = {}
    ) {
        try {
            await db.insert(activityLogs).values({
                workspaceId,
                userId,
                action,
                entityType,
                entityId,
                metadata,
            });
        } catch (error) {
            console.error("Failed to log activity:", error);
            // Don't throw, as activity logging shouldn't block main actions
        }
    }

    /**
     * Get recent activity for a workspace.
     */
    static async getWorkspaceActivity(workspaceId: string, limit: number = 20) {
        return await db.query.activityLogs.findMany({
            where: eq(activityLogs.workspaceId, workspaceId),
            orderBy: [desc(activityLogs.createdAt)],
            limit: limit,
            with: {
                actor: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            }
        });
    }
}
