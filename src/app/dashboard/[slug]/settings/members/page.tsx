"use client";

import { useEffect, useState } from "react";
import { Loader2, UserPlus, X, Mail } from "lucide-react";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";

interface Member {
    user: {
        id: string;
        email: string;
        name?: string | null;
        image?: string | null;
    };
    role: string;
    joinedAt: string;
}

interface Invite {
    id: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export default function MembersSettingsPage({ params }: { params: { slug: string } }) {
    const [slug, setSlug] = useState<string>("");
    // We need to unwrap params in Next 15 if passing directly, 
    // but this is a client component, so we can use useParams or await params if server passed props.
    // Actually, page.tsx props are params promise in Next 15.
    // But wait, this file is "page.tsx" so it's a Server Component by default unless "use client" is at top.
    // I added "use client" at top.
    // In Next.js 15, params is a Promise. We need to unwrap it with `use` or useEffect.

    // Let's use `useParams` from next/navigation which is synchronous usually or easier in client components.
    // Or handle the promise.

    const [members, setMembers] = useState<Member[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        // Basic unwrapping if needed, or just use the prop. 
        // If params is a promise, we need to await it. 
        // But since we are in "use client", the props passed from layout might be already resolved?
        // Actually, distinct page.tsx in dashboard/[slug] gets params.
        // Let's assume params.slug works or use standard fetch pattern.

        // Safer:
        const loadData = async () => {
            try {
                // Next 15: params is a promise
                const resolvedParams = await params;
                setSlug(resolvedParams.slug);

                await fetchMembers(resolvedParams.slug);
                await fetchInvites(resolvedParams.slug);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [params]);

    async function fetchMembers(currentSlug: string) {
        const res = await fetch(`/api/workspaces/${currentSlug}/members`);
        if (res.ok) {
            const data = await res.json();
            setMembers(data.members);
        }
    }

    async function fetchInvites(currentSlug: string) {
        const res = await fetch(`/api/workspaces/${currentSlug}/invites`);
        if (res.ok) {
            const data = await res.json();
            setInvites(data.invites);
        }
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
                    <p className="text-muted-foreground">Manage who has access to this workspace.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors bg-black text-white"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                </button>
            </div>

            <InviteMemberDialog
                slug={slug}
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={() => {
                    fetchInvites(slug); // Refresh invites list
                }}
            />

            {/* Members List */}
            <div className="rounded-md border bg-background">
                <div className="p-4 border-b bg-muted/30 font-medium text-sm">Active Members ({members.length})</div>
                <div className="divide-y">
                    {members.map((member) => (
                        <div key={member.user.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                    {member.user.image ? (
                                        <img src={member.user.image} alt={member.user.name || ""} className="rounded-full" />
                                    ) : (
                                        (member.user.name || member.user.email).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{member.user.name || "User"}</div>
                                    <div className="text-xs text-muted-foreground">{member.user.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                                    {member.role}
                                </span>
                                {/* Add Manage Menu Here (Remove, Change Role) */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div className="rounded-md border bg-background">
                    <div className="p-4 border-b bg-muted/30 font-medium text-sm text-yellow-600">Pending Invitations ({invites.length})</div>
                    <div className="divide-y">
                        {invites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between p-4 opacity-75">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted/50 border border-dashed flex items-center justify-center text-sm font-medium text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{invite.email}</div>
                                        <div className="text-xs text-muted-foreground">Invited as {invite.role}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Pending</span>
                                    <button
                                        className="text-xs text-red-500 hover:text-red-700 hover:underline px-2"
                                        onClick={() => {
                                            // Make API call to revoke
                                            // For now just console log
                                            console.log("Revoke", invite.id);
                                        }}
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
