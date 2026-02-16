"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            // API always returns 200 OK for security reasons unless 429
            if (response.status === 429) {
                throw new Error("Too many requests. Please try again later.");
            }

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Check your email</h1>
                <p className="text-muted-foreground text-sm">
                    If an account exists for that email, we have sent password reset instructions.
                </p>
                <div className="pt-4">
                    <Link href="/login" className="text-sm font-medium text-foreground hover:underline underline-offset-4">
                        Return to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Trouble logging in?</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email and we'll send you a link to get back into your account.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none text-muted-foreground"
                        htmlFor="email"
                    >
                        Email address
                    </label>
                    <input
                        className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-foreground/50"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
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
                        <>Send Login Link <ArrowRight className="ml-2 h-4 w-4 opacity-50" /></>
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-4">
                <Link
                    href="/login"
                    className="font-medium text-foreground hover:underline underline-offset-4 transition-all"
                >
                    Back to login
                </Link>
            </div>
        </div>
    );
}
