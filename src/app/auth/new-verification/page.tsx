"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const onSubmit = useCallback(async () => {
        if (!token) {
            setError("Missing verification token.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/new-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong.");
            } else {
                setSuccess("Email verified successfully!");
            }
        } catch (error) {
            setError("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-lg shadow-sm text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Confirming your email</h1>

                {isLoading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {!isLoading && success && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                        {success}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}

