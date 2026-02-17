import { db } from "@/db";
import { invitations, members, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/mail";
import { ActivityService } from "@/modules/activity/activity.service";

export class InviteService {
    // 1. Send an Invite
    static async sendInvite(
        senderId: string,
        workspaceId: string,
        email: string,
        role: string = 'member' // Drizzle role enum
    ) {
        // PERMISSION CHECK
        const sender = await db.query.members.findFirst({
            where: and(eq(members.userId, senderId), eq(members.workspaceId, workspaceId))
        });

        if (!sender || (sender.role !== 'owner' && sender.role !== 'admin')) {
            throw new Error("Only Owners and Admins can invite members.");
        }

        // DUPLICATE CHECK
        // Check if user is already a member
        const userExists = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (userExists) {
            const isMember = await db.query.members.findFirst({
                where: and(eq(members.userId, userExists.id), eq(members.workspaceId, workspaceId))
            });
            if (isMember) throw new Error("User is already a member of this workspace.");
        }

        // TOKEN GENERATION
        const token = crypto.randomBytes(32).toString("hex");
        // Expires in 7 days
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // CREATE INVITE
        const [invite] = await db.insert(invitations).values({
            email,
            workspaceId,
            role: role as "admin" | "member" | "owner",
            token,
            expiresAt,
            inviterId: senderId,
            status: 'pending'
        }).returning();

        // EMAIL SENDING
        const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId) });
        const senderUser = await db.query.users.findFirst({ where: eq(users.id, senderId) });

        if (workspace) {
            await sendInviteEmail(email, token, senderUser?.name || "A team member", workspace.name);
        }

        await ActivityService.log(
            workspaceId,
            senderId,
            "member.invited",
            "member",
            email, // Using email as entityId for now as user might not exist
            { role, email }
        );

        return invite;
    }

    // 2. Accept an Invite
    static async acceptInvite(token: string, userId: string) {
        // Validate Token
        const invite = await db.query.invitations.findFirst({
            where: eq(invitations.token, token)
        });

        if (!invite) throw new Error("Invalid invitation token.");
        if (invite.status !== 'pending') throw new Error("Invitation already accepted or expired.");
        if (new Date() > invite.expiresAt) throw new Error("Invitation expired.");

        // Transaction to add member and update invite
        return await db.transaction(async (tx) => {
            // Check if already member
            const existing = await tx.query.members.findFirst({
                where: and(eq(members.userId, userId), eq(members.workspaceId, invite.workspaceId))
            });

            if (!existing) {
                await tx.insert(members).values({
                    userId,
                    workspaceId: invite.workspaceId,
                    role: invite.role as "admin" | "member" | "owner"
                });
            }

            // Update Invite Status
            await tx.update(invitations)
                .set({ status: 'accepted' })
                .where(eq(invitations.id, invite.id));

            // Return workspace details for redirect
            const workspace = await tx.query.workspaces.findFirst({
                where: eq(workspaces.id, invite.workspaceId)
            });

            // Log activity manually since we are inside transaction and ActivityService uses its own db call (which is fine, or we could pass tx if we refactored)
            // Ideally we run this after transaction commits, but for now we await it.
            // Note: If tx fails, this log might still persist if it was separate connection? 
            // Drizzle `db` usually separate. 
            // Let's just fire and forget or await.
            await ActivityService.log(
                invite.workspaceId,
                userId,
                "member.joined",
                "member",
                userId,
                { via: "invite" }
            );

            return workspace;
        });
    }

    // 3. Get Pending Invites for Workspace
    static async getWorkspaceInvites(workspaceId: string) {
        return await db.query.invitations.findMany({
            where: and(eq(invitations.workspaceId, workspaceId), eq(invitations.status, 'pending'))
        });
    }

    // 4. Revoke Invite
    static async revokeInvite(inviteId: string) {
        // Need to fetch invite to know workspaceId for logging
        const invite = await db.query.invitations.findFirst({
            where: eq(invitations.id, inviteId)
        });

        if (invite) {
            await db.delete(invitations).where(eq(invitations.id, inviteId));
            if (invite.inviterId) {
                await ActivityService.log(
                    invite.workspaceId,
                    invite.inviterId,
                    "invite.revoked",
                    "invite",
                    invite.email,
                    { email: invite.email }
                );
            }
        }
    }

    // 5. Get Pending Invites for User Email
    // Fetches invites sent to this user's email, including workspace details
    static async getUserInvites(email: string) {
        return await db.query.invitations.findMany({
            where: and(eq(invitations.email, email), eq(invitations.status, 'pending')),
            with: {
                workspace: true,
                inviter: true,
            }
        });
    }
}
