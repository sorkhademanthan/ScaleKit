"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role: "user" }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Something went wrong");
            }

            router.push("/login?success=true");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email below to create your account
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none text-muted-foreground"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-foreground/50"
                        id="email"
                        name="email"
                        placeholder="m@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none text-muted-foreground"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-foreground/50"
                        id="password"
                        name="password"
                        placeholder="••••••••"
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
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <>Create Account <ArrowRight className="ml-2 h-4 w-4 opacity-50" /></>
                    )}
                </button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>

            <div className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-foreground underline underline-offset-4 hover:decoration-2 transition-all"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}
