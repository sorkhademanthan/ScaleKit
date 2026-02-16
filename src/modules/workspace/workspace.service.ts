import { db } from "@/db";
import { workspaces, members, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class WorkspaceService {
    // 1. Create a workspace & add creator as owner
    static async createWorkspace(userId: string, name: string, slug: string) {
        // Enforce unique slug
        const existing = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, slug)
        });
        if (existing) throw new Error("Workspace slug already exists");

        // Transaction to ensure atomicity
        return await db.transaction(async (tx) => {
            const [workspace] = await tx.insert(workspaces).values({
                name,
                slug,
            }).returning();

            await tx.insert(members).values({
                userId,
                workspaceId: workspace.id,
                role: 'owner', // Must match database enum
            });

            // Update user's last active workspace
            await tx.update(users)
                .set({ lastActiveWorkspaceId: workspace.id })
                .where(eq(users.id, userId));

            return workspace;
        });
    }

    // 2. Get all workspaces for a user
    static async getUserWorkspaces(userId: string) {
        const results = await db.select({
            workspace: workspaces,
            role: members.role,
        })
            .from(members)
            .innerJoin(workspaces, eq(members.workspaceId, workspaces.id))
            .where(eq(members.userId, userId));

        return results.map(r => ({
            ...r.workspace,
            role: r.role
        }));
    }

    // 3. Verify membership & get role
    static async getMemberRole(userId: string, workspaceId: string) {
        const member = await db.query.members.findFirst({
            where: and(
                eq(members.userId, userId),
                eq(members.workspaceId, workspaceId)
            )
        });

        if (!member) return null;
        return member.role;
    }

    // 4. Get workspace by slug
    static async getWorkspaceBySlug(slug: string) {
        return await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, slug)
        });
    }

    // 5. Add a member directly (for internal use or accepting invites)
    static async addMember(workspaceId: string, userId: string, role: 'owner' | 'admin' | 'member') {
        // Check if already member
        const existing = await this.getMemberRole(userId, workspaceId);
        if (existing) throw new Error("User is already a member");

        await db.insert(members).values({
            userId,
            workspaceId,
            role,
        });
    }

    // 6. Get All Members (for settings page)
    static async getMembers(workspaceId: string) {
        const results = await db.select({
            user: users,
            role: members.role,
            joinedAt: members.joinedAt
        })
            .from(members)
            .innerJoin(users, eq(members.userId, users.id))
            .where(eq(members.workspaceId, workspaceId));

        // Use any map logic if we want to sanitize user object further
        return results;
    }
}
