"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose }: CreateWorkspaceDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        try {
            const response = await fetch("/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create workspace");
            }

            // Success
            router.refresh(); // Refresh server components to see new workspace
            onClose();
            // Optionally navigate to new workspace
            router.push(`/dashboard/${data.workspace.slug}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-border">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Create New Workspace</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="name">
                            Workspace Name
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="name"
                            name="name"
                            placeholder="Acme Corp"
                            required
                            minLength={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="slug">
                            Workspace Slug (URL)
                        </label>
                        <div className="flex items-center rounded-md border border-input bg-muted/50 px-3">
                            <span className="text-sm text-muted-foreground">scalekit.com/</span>
                            <input
                                className="flex h-10 w-full bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="slug"
                                name="slug"
                                placeholder="acme-corp"
                                required
                                minLength={3}
                                pattern="^[a-z0-9-]+$"
                                title="Lowercase letters, numbers, and hyphens only."
                            />
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
                            Create Workspace
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
