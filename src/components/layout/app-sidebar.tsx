"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
    Activity,
    LayoutDashboard,
    Settings,
    Users
} from "lucide-react";
import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
    workspaces: any[]; // Type properly if possible
    className?: string;
}

export function AppSidebar({ workspaces, className }: AppSidebarProps) {
    const params = useParams();
    const slug = params?.slug as string;
    const pathname = usePathname();

    // If no slug (e.g. root dashboard), maybe don't render links or default?
    // But our page.tsx redirector ensures we usually have a slug.

    const baseUrl = slug ? `/dashboard/${slug}` : "/dashboard";

    const navItems = [
        {
            title: "Overview",
            href: `${baseUrl}`, // /dashboard/slug
            icon: LayoutDashboard,
            active: pathname === baseUrl,
        },
        {
            title: "Team Members",
            href: `${baseUrl}/settings/members`,
            icon: Users,
            active: pathname?.startsWith(`${baseUrl}/settings/members`),
        },
        {
            title: "Activity",
            href: `${baseUrl}/activity`,
            icon: Activity,
            active: pathname?.startsWith(`${baseUrl}/activity`),
        },
        {
            title: "Settings",
            href: `${baseUrl}/settings`,
            icon: Settings,
            active: pathname === `${baseUrl}/settings`,
        },
    ];

    return (
        <aside className={cn("hidden lg:flex flex-col border-r bg-background/50 h-full", className)}>
            <div className="p-4 border-b">
                <WorkspaceSwitcher workspaces={workspaces} />
            </div>

            <nav className="flex flex-col gap-2 p-4 text-sm font-medium flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground hover:bg-muted/50",
                            item.active ? "bg-muted text-foreground" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}

                <div className="mt-auto pt-4 border-t">
                    <LogoutButton />
                </div>
            </nav>
        </aside>
    );
}
