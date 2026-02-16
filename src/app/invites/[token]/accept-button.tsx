"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AcceptButton({ token, workspaceSlug }: { token: string; workspaceSlug: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAccept() {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/invites/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to accept invite");
            }

            // Redirect to workspace dashboard
            router.push(`/dashboard/${data.workspace.slug}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {error && (
                <div className="rounded-md bg-red-50 p-2 text-sm text-red-500 border border-red-200">
                    {error}
                </div>
            )}
            <button
                onClick={handleAccept}
                disabled={isLoading}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Accept Invite
            </button>
        </div>
    );
}
