import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthProvider } from "@/components/providers/auth-provider";
import { User } from "@registry/auth/types";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceService } from "@/modules/workspace/workspace.service";
import { PendingInvitesAlert } from "@/components/dashboard/pending-invites-alert";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    const user = await authService.validateSession(token);

    if (!user) {
        redirect("/login");
    }

    const authenticatedUser = user as unknown as User;

    // Fetch workspaces properly
    const workspaces = await WorkspaceService.getUserWorkspaces(user.id);

    return (
        <AuthProvider user={authenticatedUser}>
            <div className="min-h-screen bg-muted/20">
                {/* Top Navigation - Consider moving this if redundant or updating links */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-lg">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                            S
                        </div>
                        <span>ScaleKit</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
                        <Link href="/docs/intro" className="text-muted-foreground transition-colors hover:text-foreground">
                            Documentation
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                    </nav>
                </header>

                <div className="grid lg:grid-cols-5 min-h-[calc(100vh-4rem)]">
                    {/* Sidebar Navigation */}
                    <AppSidebar workspaces={workspaces} />

                    {/* Main Content Area */}
                    <main className="lg:col-span-4 p-8 space-y-8 animate-fade-in relative">
                        <PendingInvitesAlert />
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
