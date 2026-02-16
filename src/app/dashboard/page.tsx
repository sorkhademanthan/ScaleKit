import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    Activity,
    CreditCard,
    DollarSign,
    Users
} from "lucide-react";
// import { hasPermission } from "@registry/auth/rbac"; // Use Client Component wrapper if preferred, or keep server check. 
// Actually, let's keep server check for initial render if possible. 
// But since we have AuthProvider, we can also use client components if we want interactivity.
// For now, simple server logic is fine.
import { hasPermission } from "@registry/auth/rbac";

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
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        Download Report
                    </button>
                </div>
            </div>

            {!user.emailVerified && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-400 p-4 rounded-r shadow-sm" role="alert">
                    <p className="font-bold">Email not verified</p>
                    <p>Please check your email inbox to verify your account.</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: DollarSign },
                    { title: "Active Users", value: "+2350", change: "+180.1% from last month", icon: Users },
                    { title: "Sales", value: "+12,234", change: "+19% from last month", icon: CreditCard },
                    { title: "Active Now", value: "+573", change: "+201 since last hour", icon: Activity },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-2">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.title}</h3>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / User Info */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">Overview</h3>
                    <div className="h-[200px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">Your Profile</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none">{user.email}</p>
                                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="text-xs text-muted-foreground">User ID:</div>
                            <div className="text-xs font-mono bg-muted p-1 rounded mt-1">{user.id}</div>
                        </div>

                        {hasPermission({ role: user.role } as any, 'view:analytics') && (
                            <div className="pt-4 border-t">
                                <p className="text-xs text-green-600 font-medium">✨ Admin Analytics Access</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
