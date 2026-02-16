"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
// import { toast } from "sonner"; // Assuming we have sonner, else fallback to alert or state

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!token) {
        return (
            <div className="space-y-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-red-600">Invalid Link</h1>
                <p className="text-muted-foreground text-sm">
                    This password reset link is invalid or has expired.
                </p>
                <Link href="/login" className="text-sm font-medium text-foreground hover:underline underline-offset-4">
                    Return to login
                </Link>
            </div>
        );
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // Success
            // Use toast if available, or simple alert/redirect
            // alert("Password reset successful! Please login."); 
            // Better UX: Show UI state.

            router.push("/login?reset=success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset Password</h1>
                <p className="text-muted-foreground text-sm">
                    Create a new strong password for your account.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none text-muted-foreground"
                        htmlFor="password"
                    >
                        New Password
                    </label>
                    <input
                        className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-foreground/50"
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none text-muted-foreground"
                        htmlFor="confirmPassword"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-foreground/50"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                    />
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 border border-red-200">
                        {error}
                    </div>
                )}

                <button
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <>Reset Password <ArrowRight className="ml-2 h-4 w-4 opacity-50" /></>
                    )}
                </button>
            </form>
        </div>
    );
}
