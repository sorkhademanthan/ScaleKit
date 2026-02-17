"use client";

import { useEffect, useState } from "react";
import { Loader2, UserPlus, X, Mail, RefreshCw } from "lucide-react";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { useAuth } from "@/components/providers/auth-provider";

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
    const { user: currentUser } = useAuth();
    const [slug, setSlug] = useState<string>("");

    // We handle params unwrapping for safety

    const [members, setMembers] = useState<Member[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
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
        if (!currentSlug) return;
        const res = await fetch(`/api/workspaces/${currentSlug}/members`);
        if (res.ok) {
            const data = await res.json();
            setMembers(data.members);
        }
    }

    async function fetchInvites(currentSlug: string) {
        if (!currentSlug) return;
        const res = await fetch(`/api/workspaces/${currentSlug}/invites`);
        if (res.ok) {
            const data = await res.json();
            setInvites(data.invites);
        }
    }

    async function handleRefresh() {
        if (!slug) return;
        setIsRefreshing(true);
        await Promise.all([fetchMembers(slug), fetchInvites(slug)]);
        setIsRefreshing(false);
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
                    <p className="text-muted-foreground">Manage who has access to this workspace.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        title="Refresh List"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => setIsInviteOpen(true)}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition-colors"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite User
                    </button>
                </div>
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
                <div className="p-4 border-b bg-muted/30 font-medium text-sm flex justify-between items-center">
                    <span>Active Members ({members.length})</span>
                </div>
                <div className="divide-y">
                    {members.map((member) => {
                        const isMe = currentUser?.id === member.user.id;
                        return (
                            <div key={member.user.id} className={`flex items-center justify-between p-4 ${isMe ? "bg-muted/10" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium overflow-hidden">
                                        {member.user.image ? (
                                            <img src={member.user.image} alt={member.user.name || ""} className="h-full w-full object-cover" />
                                        ) : (
                                            (member.user.name || member.user.email).charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm flex items-center gap-2">
                                            {member.user.name || "User"}
                                            {isMe && <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">YOU</span>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{member.user.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                                        {member.role}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
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
