import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    name: string | null;
    email: string | null;
}

interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return new Response("GitHub credentials not configured", { status: 500 });
    }

    try {
        // Exchange code for access token
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            console.error("GitHub Token Error:", tokenData);
            return new Response("GitHub Token Error", { status: 400 });
        }

        const accessToken = tokenData.access_token;

        // Fetch User Data
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const githubUser: GitHubUser = await userRes.json();

        // Fetch Email (might be private)
        let email = githubUser.email;
        if (!email) {
            const emailRes = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const emails: GitHubEmail[] = await emailRes.json();
            const primary = emails.find((e) => e.primary && e.verified);
            email = primary ? primary.email : null;
        }

        if (!email) {
            return new Response("No verified email found on GitHub account", { status: 400 });
        }

        // Delegate to AuthService to find or create user
        // We might need to extend AuthService to handle OAuth explicitly
        // reusing logic for now:

        // 1. Check if user exists by GitHub ID first (best practice)
        // Since we don't have findByGithubId exposed directly on AuthService yet, 
        // we can try to find by email.

        // Actually, we should add `loginWithGithub` to AuthService for clean architecture.
        // For now, let's do it here or extend AuthService.

        // Let's extend AuthService first.
        const result = await authService.loginWithGithub(
            email,
            githubUser.id.toString(),
            githubUser.name || githubUser.login,
            githubUser.avatar_url
        );

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            // 7 days
            maxAge: 60 * 60 * 24 * 7,
        });

        return redirect("/dashboard");

    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
