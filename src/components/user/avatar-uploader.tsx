"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AvatarUploaderProps {
    currentAvatarUrl?: string | null;
    userName: string;
}

export function AvatarUploader({ currentAvatarUrl, userName }: AvatarUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(currentAvatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Optimistic UI: Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setAvatar(objectUrl);
        setIsLoading(true);

        try {
            // 1. Get Signature
            const signRes = await fetch("/api/v1/user/avatar/upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileType: file.type,
                    fileSize: file.size,
                }),
            });

            if (!signRes.ok) throw new Error("Failed to get upload signature");
            const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.error?.message || "Upload failed");
            }

            const data = await uploadRes.json();
            const publicUrl = data.secure_url;

            // 3. Confirm Upload to Backend
            const confirmRes = await fetch("/api/v1/user/avatar/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileKey: data.public_id, // Cloudinary Public ID
                    publicUrl: publicUrl
                }),
            });

            if (!confirmRes.ok) throw new Error("Failed to update profile");

            // Success! Refresh to update server components if any
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Upload failed. Please try again.");
            // Revert optimism on error
            setAvatar(currentAvatarUrl || null);
        } finally {
            setIsLoading(false);
            // Cleanup
            URL.revokeObjectURL(objectUrl);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <div className="relative group">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-muted bg-muted shadow-sm">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            sizes="96px"
                            priority
                            onError={() => setAvatar(null)} // Fallback if URL fails
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-2xl font-bold uppercase">
                            {userName.charAt(0)}
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Camera className="text-white h-6 w-6" />
                    </div>

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <Loader2 className="text-white h-6 w-6 animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold text-lg">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">
                    Upload a new avatar. Max size 5MB.
                </p>
                <div className="flex gap-2 mt-2">
                    <button
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload
                    </button>
                    {/* Hidden input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
}
