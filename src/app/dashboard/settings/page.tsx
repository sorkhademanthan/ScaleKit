import { authService } from "@/lib/auth-singleton";
import { AvatarUploader } from "@/components/user/avatar-uploader";
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
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-semibold tracking-tight">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <div className="border-t pt-6">
                <AvatarUploader
                    currentAvatarUrl={user.image}
                    userName={user.name || user.email}
                />
            </div>
            {/* Future: Name Update Form, Password Change, etc. */}
        </div>
    );
}
