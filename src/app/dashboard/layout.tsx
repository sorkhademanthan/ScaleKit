import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Activity,
    LayoutDashboard,
    Settings,
    Users
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AuthProvider } from "@/components/providers/auth-provider";
import { User } from "@registry/auth/types";

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

    // Pass token to validateSession. 
    // Ideally we cache this call if used in children pages too.
    const user = await authService.validateSession(token);

    if (!user) {
        redirect("/login");
    }

    // Cast partial user to full User for context (safe as context handles missing fields gracefully or we ensure types match)
    // Actually AuthProvider expects User | null.
    // validateSession returns Omit<User, 'passwordHash'>
    // We can cast effectively.
    const authenticatedUser = user as unknown as User;

    return (
        <AuthProvider user={authenticatedUser}>
            <div className="min-h-screen bg-muted/20">
                {/* Top Navigation */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-lg">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                            S
                        </div>
                        <span>ScaleKit</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
                        <Link href="/docs/intro" className="text-muted-foreground transition-colors hover:text-foreground">
                            Documentation
                        </Link>
                        <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                            Support
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                    </nav>
                </header>

                <div className="grid lg:grid-cols-5 min-h-[calc(100vh-4rem)]">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block border-r bg-background/50">
                        <nav className="flex flex-col gap-2 p-4 text-sm font-medium h-full">
                            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50">
                                <LayoutDashboard className="h-4 w-4" />
                                Overview
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50">
                                <Users className="h-4 w-4" />
                                Team Members
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50">
                                <Activity className="h-4 w-4" />
                                Activity
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50">
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <div className="mt-auto pt-4 border-t">
                                <LogoutButton />
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-4 p-8 space-y-8 animate-fade-in">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
