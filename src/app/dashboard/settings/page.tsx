import { authService } from "@/lib/auth-singleton";
import { ProfileForm } from "@/components/user/profile-form";
import { ModeToggle } from "@/components/mode-toggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings - ScaleKit",
    description: "Manage your account settings",
};

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    const user = await authService.validateSession(token);
    if (!user) redirect("/login");

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6">
            <div>
                <h3 className="text-3xl font-bold tracking-tight">Settings</h3>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="border-t pt-6">
                <ProfileForm user={user} />
            </div>

            <div className="border-t pt-6 max-w-2xl">
                <div className="flex flex-col space-y-1.5 mb-6">
                    <h3 className="font-semibold text-xl leading-none tracking-tight">Appearance</h3>
                    <p className="text-sm text-muted-foreground">
                        Customize the look and feel of the application.
                    </p>
                </div>
                <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Theme Preference</p>
                        <p className="text-xs text-muted-foreground mt-1">Select your preferred theme.</p>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
