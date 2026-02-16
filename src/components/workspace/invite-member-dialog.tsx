"use client";

import { useState } from "react";
import { Loader2, Mail, Plus, X } from "lucide-react";
import { useParams } from "next/navigation";

interface InviteMemberDialogProps {
    slug: string; // Add slug prop
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function InviteMemberDialog({ slug, isOpen, onClose, onSuccess }: InviteMemberDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("member");

    if (!isOpen) return null;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        try {
            const response = await fetch(`/api/workspaces/${slug}/invites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to invite member");
            }

            onSuccess?.();
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-border">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Invite Team Member</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="colleague@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Role</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 border rounded p-3 w-full cursor-pointer hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                                <input
                                    type="radio"
                                    name="role"
                                    value="member"
                                    checked={role === "member"}
                                    onChange={() => setRole("member")}
                                    className="accent-primary"
                                />
                                <div>
                                    <div className="font-medium text-sm">Member</div>
                                    <div className="text-xs text-muted-foreground">Can view and edit workspace resources.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 border rounded p-3 w-full cursor-pointer hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === "admin"}
                                    onChange={() => setRole("admin")}
                                    className="accent-primary"
                                />
                                <div>
                                    <div className="font-medium text-sm">Admin</div>
                                    <div className="text-xs text-muted-foreground">Can manage settings and invite others.</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors bg-black text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
