import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
    id: string; // Google returns ID as string
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = "http://localhost:3000/api/auth/callback/google";

    if (!clientId || !clientSecret) {
        return new Response("Google credentials not configured", { status: 500 });
    }

    try {
        // Exchange code for access token
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            console.error("Google Token Error:", tokenData);
            return new Response("Google Token Error", { status: 400 });
        }

        const accessToken = tokenData.access_token;

        // Fetch User Data from Google People API or UserInfo
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const googleUser: GoogleUser = await userRes.json();

        if (!googleUser.email) {
            return new Response("No email found on Google account", { status: 400 });
        }

        // Delegate to AuthService
        const result = await authService.loginWithGoogle(
            googleUser.email,
            googleUser.id,
            googleUser.name,
            googleUser.picture
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

        // Redirect to dashboard (Use NextResponse to avoid error)
        return NextResponse.redirect(new URL("/dashboard", req.url));

    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
