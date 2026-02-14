import { redirect } from "next/navigation";

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:3000/api/auth/callback/google"; // Must match your Google Cloud configuration exactly

    if (!clientId) {
        return new Response("Google Client ID not configured", { status: 500 });
    }

    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent", // Force consent screen to ensure refresh token if needed, or just better UX
    });

    return redirect(`${authUrl}?${params.toString()}`);
}
