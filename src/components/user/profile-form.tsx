"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarUploader } from "./avatar-uploader";
import { Loader2 } from "lucide-react";

interface User {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    bio?: string | null;
}

interface ProfileFormProps {
    user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/v1/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to update profile");
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Avatar Section */}
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 mb-6">
                    <h3 className="font-semibold text-xl leading-none tracking-tight">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                        This will be displayed on your public profile.
                    </p>
                </div>
                <AvatarUploader currentAvatarUrl={user.image} userName={user.name || user.email} />
            </div>

            {/* Profile Details Form */}
            <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm space-y-6">
                <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold text-xl leading-none tracking-tight">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">
                        Update your personal details here.
                    </p>
                </div>

                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Display Name
                        </label>
                        <input
                            id="name"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us a little bit about yourself (max 160 chars)"
                            maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {bio.length}/160
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                        </label>
                        <input
                            className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm cursor-not-allowed opacity-50"
                            value={user.email}
                            disabled
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Email cannot be changed directly. Contact support.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
