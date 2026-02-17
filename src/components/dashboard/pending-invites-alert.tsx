"use client";

import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkspaceInvite {
    id: string;
    token: string;
    workspace: {
        name: string;
        slug: string;
    };
    inviter: {
        name: string | null;
        email: string;
    }
}

export function PendingInvitesAlert() {
    const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/user/invites")
            .then((res) => res.json())
            .then((data) => {
                if (data.invites) {
                    setInvites(data.invites);
                }
            })
            .catch(console.error);
    }, []);

    if (invites.length === 0) return null;

    const handleAccept = async (token: string) => {
        try {
            const res = await fetch("/api/invites/accept", {
                method: "POST",
                body: JSON.stringify({ token })
            });
            if (res.ok) {
                const data = await res.json();
                // Refresh to remove item and maybe redirect
                setInvites((prev) => prev.filter(i => i.token !== token));
                router.push(`/dashboard/${data.workspace.slug}`);
                router.refresh(); // hard refresh to update sidebar
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-indigo-600 text-white px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 animate-pulse" />
                    <span className="font-medium">
                        You have {invites.length} pending workspace invitation{invites.length > 1 ? 's' : ''}.
                    </span>
                </div>

                <div className="flex gap-4">
                    {invites.map((invite) => (
                        <div key={invite.id} className="flex items-center gap-2 bg-indigo-700 rounded-full px-3 py-1 text-sm">
                            <span>Join <strong>{invite.workspace.name}</strong>?</span>
                            <button
                                onClick={() => handleAccept(invite.token)}
                                className="bg-white text-indigo-700 rounded-full p-1 hover:bg-indigo-50 transition-colors"
                                title="Accept"
                            >
                                <Check className="h-3 w-3" />
                            </button>
                            {/* Add decline logic later */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
