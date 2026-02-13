import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    const user = await authService.validateSession(token);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <span className="font-bold">ScaleKit Dashboard</span>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 flex flex-col space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">User Profile</span>
                            <span className="text-2xl font-bold">{user.email}</span>
                            <span className="text-xs text-muted-foreground">Role: {user.role}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
