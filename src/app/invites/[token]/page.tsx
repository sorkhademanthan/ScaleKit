import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { invitations, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { XCircle } from "lucide-react";
import Link from "next/link";
// import client component
import { AcceptButton } from "./accept-button";

export default async function AcceptInvitePage({ params }: { params: { token: string } }) {
    const { token } = await params;

    // 1. Verify Token (Read-only check first)
    const invite = await db.query.invitations.findFirst({
        where: eq(invitations.token, token)
    });

    if (!invite || invite.status !== 'pending' || new Date() > invite.expiresAt) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold">Invalid Invitation</h1>
                <p className="text-muted-foreground mt-2">This invitation link is invalid or has expired.</p>
                <Link href="/" className="mt-6 text-primary hover:underline">Return Home</Link>
            </div>
        );
    }

    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, invite.workspaceId)
    });

    if (!workspace) return notFound();

    // 2. Auth Check
    const cookieStore = await cookies();
    const authToken = cookieStore.get("token")?.value;
    // We can't use authService.validateSession directly if it relies on something not available? 
    // No, it should be fine.

    // Fix: Handle null authToken gracefully
    let user = null;
    if (authToken) {
        try {
            user = await authService.validateSession(authToken);
        } catch (e) {
            // Token invalid
        }
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center max-w-md mx-auto">
                <div className="h-12 w-12 rounded-lg bg-black text-white flex items-center justify-center mb-6 text-xl font-bold">S</div>
                <h1 className="text-2xl font-bold">You've been invited to join {workspace.name}</h1>
                <p className="text-muted-foreground mt-2">Log in or create an account to accept this invitation.</p>

                <div className="flex flex-col gap-3 w-full mt-8">
                    <Link
                        href={`/login?callbackUrl=/invites/${token}`}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-black text-white px-8 text-sm font-medium shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
                    >
                        Log In
                    </Link>
                    <Link
                        href={`/register?callbackUrl=/invites/${token}`}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center max-w-md mx-auto">
            <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center mb-6 text-2xl font-bold uppercase border">
                {workspace.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold">Join {workspace.name}</h1>
            <p className="text-muted-foreground mt-2">
                You are accepting this invitation as <span className="font-medium text-foreground">{user.email}</span>
            </p>

            <div className="w-full mt-8">
                <AcceptButton token={token} workspaceSlug={workspace.slug} />
            </div>

            <p className="text-xs text-muted-foreground mt-6">
                By joining, you agree to the terms and privacy policy.
            </p>
        </div>
    );
}
