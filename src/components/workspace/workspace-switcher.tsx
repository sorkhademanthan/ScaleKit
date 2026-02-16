"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, ChevronsUpDown, Plus, LayoutGrid } from "lucide-react";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll inline

// Simple Popover/Dropdown using raw HTML/CSS for now due to lack of Shadcn
// We'll use a simple absolute positioned div toggle.

interface Workspace {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
}

interface WorkspaceSwitcherProps {
    workspaces: Workspace[];
    className?: string;
}

export function WorkspaceSwitcher({
    workspaces,
    className,
}: WorkspaceSwitcherProps) {
    const router = useRouter();
    const params = useParams();
    const activeSlug = params?.slug as string;

    const [open, setOpen] = React.useState(false);
    const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
    const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace | undefined>(
        workspaces.find((w) => w.slug === activeSlug) || workspaces[0]
    );

    // Sync state if params change
    React.useEffect(() => {
        if (activeSlug) {
            const found = workspaces.find(w => w.slug === activeSlug);
            if (found) setActiveWorkspace(found);
        }
    }, [activeSlug, workspaces]);


    return (
        <div className={cn("relative w-full", className)}>
            <CreateWorkspaceDialog
                isOpen={showNewTeamDialog}
                onClose={() => setShowNewTeamDialog(false)}
            />

            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground bg-black text-white uppercase">
                        {activeWorkspace?.name.charAt(0) || "S"}
                    </div>
                    <span className="truncate">{activeWorkspace?.name || "Select Team"}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

                    <div className="absolute top-full mt-2 w-[200px] z-20 min-w-[12rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 bg-white text-black p-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Teams
                        </div>

                        {workspaces.map((workspace) => (
                            <button
                                key={workspace.id}
                                onClick={() => {
                                    setActiveWorkspace(workspace);
                                    setOpen(false);
                                    router.push(`/dashboard/${workspace.slug}`);
                                }}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100",
                                    activeWorkspace?.id === workspace.id && "bg-accent text-accent-foreground font-medium"
                                )}
                            >
                                <div className="flex h-4 w-4 mr-2 items-center justify-center rounded-sm border bg-background text-[10px] font-medium uppercase">
                                    {workspace.name.charAt(0)}
                                </div>
                                <span className="truncate flex-1 text-left">{workspace.name}</span>
                                {activeWorkspace?.id === workspace.id && (
                                    <Check className="ml-auto h-4 w-4" />
                                )}
                            </button>
                        ))}

                        <div className="h-px bg-muted my-1" />

                        <button
                            onClick={() => {
                                setOpen(false);
                                setShowNewTeamDialog(true);
                            }}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Team
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
